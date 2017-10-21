var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname+'/client-side'));


// app.get('/css', function(req, res){
//   res.sendFile(__dirname+'/css/index2.html');
// });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var accountList = [
  {'id':'test', 'password':'test'},
  {'id':'pyl', 'password':'pyl'},
  {'id':'lwk', 'password':'lwk'},
  {'id':'kcp', 'password':'kcp'}
];
var rooms = [
  {'id':'1', 'code':'101', 'isBooked':false, 'capacity': 1, 'accountId':'', }
,{'id':'2', 'code':'102', 'isBooked':false, 'capacity': 2, 'accountId':''}
,{'id':'3', 'code':'103', 'isBooked':false, 'capacity': 2, 'accountId':''}
,{'id':'4', 'code':'201', 'isBooked':false, 'capacity': 4, 'accountId':''}
,{'id':'5', 'code':'202', 'isBooked':false, 'capacity': 4, 'accountId':''}
,{'id':'6', 'code':'203', 'isBooked':false, 'capacity': 1, 'accountId':''}
];

var sessionList = {};

function wrapResp(resp, success, message, data){
  resp({'success':success, 'message':message, 'data':data});
}

function findRoom(id){
  var result = null;
  rooms.forEach(function(room){
    if(room.id == id){
      result = room
      return;
    }
  });
  return result;
}

// function broadcastToLoggedInUsers(){
//   var loggedIdList = [];
//   for (var socketId in sessionList) {
//     if (sessionList.hasOwnProperty(sessionId)) {
//       var session = sessionList[socketId];
//       if(session.accountId != null && session.accountId != undefined){
//         loggedIdList.push(socketId);
//       }
//     }
//   }

// }

function buildRespRooms(accountId){
  let respRooms = rooms.slice(0);//clone array
  respRooms.forEach(function(room){
    // console.log(room.accountId == session.accountId);
    room.canCancel = (room.accountId == accountId) && room.isBooked;
  });
  return respRooms;
}

function broadcastRooms(){
  var clients = io.sockets.adapter.rooms['loggedInUser'].sockets;

  for (var clientId in clients ) {
    //this is the socket of each client in the room.
    var client = io.sockets.connected[clientId];
    console.log('clientId:'+client.id);
    console.log('accountId:'+sessionList[client.id].accountId);
    client.emit('rooms', buildRespRooms(sessionList[client.id].accountId));
  }
}

io.on('connection', function(socket){
  
  // session.socket.id;
  var socketId = socket.id;
  sessionList[socketId] = {'accountId':null};
  var session = sessionList[socketId];

  function loginFilter(callback){
    console.log('session:'+session);
    if(session.accountId == null || session.accountId == undefined){
      return (function(req, resp){
        wrapResp(resp, false, 'Need to login first', {'errorCode':'401'});
      });
    }else{
      return callback;
    }
  }

  

  console.log('a user connected:'+socketId);

  // socket.broadcast.emit('hi');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  // socket.on('client', function(msg){
  //   console.log('message: ' + msg);
  // });

  socket.on('login', function(loginAccount, resp){
    console.log('socketId:'+socketId);
    console.log(loginAccount);
    var success = false;
    // for (var i = 0,length = accountList.length; i < length; i++) {
    //   var account = accountList[i];
    //   if(account.id===loginAccount.id && account.password === loginAccount.password){
    //     success = true;
    //     break;
    //   }
    // }

    accountList.forEach(function(account) {
      if(account.id===loginAccount.id && account.password === loginAccount.password){
        success = true;
        session.accountId = loginAccount.id;

        socket.join('loggedInUser', () => {
          // let rooms = Object.keys(socket.rooms);
          // console.log(rooms); // [ <socket.id>, 'room 237' ]
           // broadcast to everyone in the room
          //  io.to('loggedInUser').emit('rooms', rooms);

        });
        
        socket.emit('rooms', buildRespRooms(session.accountId));
        return;
      }
    }, this);
    wrapResp(resp, success);

    // rooms[0].isBooked = true;
    // socket.emit('rooms', rooms);
    // io.sockets.emit('rooms', rooms);
  });

  socket.on('rooms-update', function(req, resp){
    loginFilter(function(newRooms, resp){
      var success = false;
      try {
        newRooms.forEach(function(newRoom){
          var room = findRoom(newRoom.id);
          if(room){
            if(room.isBooked && room.accountId == session.accountId){
              room.isBooked = false;
            }else if(!room.isBooked){

              room.isBooked = true;
              room.accountId = session.accountId;
            }

          }
        });

        // io.sockets.emit('rooms', rooms);
        // io.to('loggedInUser').emit('rooms', rooms);

        broadcastRooms();
      } catch (error) {
        console.log(error);
      }
      
      wrapResp(resp, success);
    })(req, resp);
  });

  socket.on('rooms', function(req, resp){
    loginFilter(function(req, resp){
      resp(buildRespRooms(session.accountId));
    })(req, resp);;
  });

});