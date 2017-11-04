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
  {'id':'1', 'code':'101', 'capacity': 1, 'timeSlots':[
		{'id':1,'time':'9:00-10:00','isBooked':false,'accountId':''}
		,{'id':2,'time':'10:00-11:00','isBooked':false,'accountId':''}
		,{'id':3,'time':'11:00-12:00','isBooked':false,'accountId':''}
		,{'id':4,'time':'12:00-13:00','isBooked':false,'accountId':''}
		,{'id':5,'time':'13:00-14:00','isBooked':false,'accountId':''}
		,{'id':6,'time':'14:00-15:00','isBooked':false,'accountId':''}
		,{'id':7,'time':'15:00-16:00','isBooked':false,'accountId':''}
		,{'id':8,'time':'16:00-17:00','isBooked':false,'accountId':''}
		,{'id':9,'time':'17:00-18:00','isBooked':false,'accountId':''}
	] }
,{'id':'2', 'code':'102', 'capacity': 2, 'timeSlots':[
	{'id':1,'time':'9:00-10:00','isBooked':false,'accountId':''}
	,{'id':2,'time':'10:00-11:00','isBooked':false,'accountId':''}
	,{'id':3,'time':'11:00-12:00','isBooked':false,'accountId':''}
	,{'id':4,'time':'12:00-13:00','isBooked':false,'accountId':''}
	,{'id':5,'time':'13:00-14:00','isBooked':false,'accountId':''}
	,{'id':6,'time':'14:00-15:00','isBooked':false,'accountId':''}
	,{'id':7,'time':'15:00-16:00','isBooked':false,'accountId':''}
	,{'id':8,'time':'16:00-17:00','isBooked':false,'accountId':''}
	,{'id':9,'time':'17:00-18:00','isBooked':false,'accountId':''}
] }
,{'id':'3', 'code':'103', 'capacity': 2, 'timeSlots':[
	{'id':1,'time':'9:00-10:00','isBooked':false,'accountId':''}
	,{'id':2,'time':'10:00-11:00','isBooked':false,'accountId':''}
	,{'id':3,'time':'11:00-12:00','isBooked':false,'accountId':''}
	,{'id':4,'time':'12:00-13:00','isBooked':false,'accountId':''}
	,{'id':5,'time':'13:00-14:00','isBooked':false,'accountId':''}
	,{'id':6,'time':'14:00-15:00','isBooked':false,'accountId':''}
	,{'id':7,'time':'15:00-16:00','isBooked':false,'accountId':''}
	,{'id':8,'time':'16:00-17:00','isBooked':false,'accountId':''}
	,{'id':9,'time':'17:00-18:00','isBooked':false,'accountId':''}
] }
,{'id':'4', 'code':'201', 'capacity': 4, 'timeSlots':[
	{'id':1,'time':'9:00-10:00','isBooked':false,'accountId':''}
	,{'id':2,'time':'10:00-11:00','isBooked':false,'accountId':''}
	,{'id':3,'time':'11:00-12:00','isBooked':false,'accountId':''}
	,{'id':4,'time':'12:00-13:00','isBooked':false,'accountId':''}
	,{'id':5,'time':'13:00-14:00','isBooked':false,'accountId':''}
	,{'id':6,'time':'14:00-15:00','isBooked':false,'accountId':''}
	,{'id':7,'time':'15:00-16:00','isBooked':false,'accountId':''}
	,{'id':8,'time':'16:00-17:00','isBooked':false,'accountId':''}
	,{'id':9,'time':'17:00-18:00','isBooked':false,'accountId':''}
] }
,{'id':'5', 'code':'202', 'capacity': 4, 'timeSlots':[
	{'id':1,'time':'9:00-10:00','isBooked':false,'accountId':''}
	,{'id':2,'time':'10:00-11:00','isBooked':false,'accountId':''}
	,{'id':3,'time':'11:00-12:00','isBooked':false,'accountId':''}
	,{'id':4,'time':'12:00-13:00','isBooked':false,'accountId':''}
	,{'id':5,'time':'13:00-14:00','isBooked':false,'accountId':''}
	,{'id':6,'time':'14:00-15:00','isBooked':false,'accountId':''}
	,{'id':7,'time':'15:00-16:00','isBooked':false,'accountId':''}
	,{'id':8,'time':'16:00-17:00','isBooked':false,'accountId':''}
	,{'id':9,'time':'17:00-18:00','isBooked':false,'accountId':''}
] }
,{'id':'6', 'code':'203', 'capacity': 1, 'timeSlots':[
	{'id':1,'time':'9:00-10:00','isBooked':false,'accountId':''}
	,{'id':2,'time':'10:00-11:00','isBooked':false,'accountId':''}
	,{'id':3,'time':'11:00-12:00','isBooked':false,'accountId':''}
	,{'id':4,'time':'12:00-13:00','isBooked':false,'accountId':''}
	,{'id':5,'time':'13:00-14:00','isBooked':false,'accountId':''}
	,{'id':6,'time':'14:00-15:00','isBooked':false,'accountId':''}
	,{'id':7,'time':'15:00-16:00','isBooked':false,'accountId':''}
	,{'id':8,'time':'16:00-17:00','isBooked':false,'accountId':''}
	,{'id':9,'time':'17:00-18:00','isBooked':false,'accountId':''}
] }
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

function findTimeSlot(room, id){
	var result = null;
	room && room.timeSlots.forEach(function(timeSlot){
		if(timeSlot.id == id){
			result = timeSlot;
			return;
		}
	})
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
		room.timeSlots.forEach(function(timeSlot){
			timeSlot.canCancel = (timeSlot.accountId == accountId) && timeSlot.isBooked;
		})
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

// io.use((socket, next) => {
//   let clientId = socket.handshake.headers['x-clientid'];
//   if (clientId) {
//   	// session
// 		socket.id = clientId;
//   }
//   return next();
// });

function findCookieSessionId(cookieStr){
	var cookies = cookieStr?cookieStr.split(';'):[];
	for(var i=0,length=cookies.length;i<length;i++){
		if(cookies[i].startsWith('io=')){
			return cookies[i].substring(3);
		}
	}
	return null;
}

io.on('connection', function(socket){
	var clientSessionId = findCookieSessionId(socket.handshake.headers.cookie)
	console.log('client existing session id:'+clientSessionId);
  // session.socket.id;
  var socketId = socket.id;
	console.log('new session id:'+socketId);

	if (clientSessionId && sessionList[clientSessionId]) {
		//recovery session
		console.log('recovery session');
		sessionList[socketId] = sessionList[clientSessionId];
		sessionList[clientSessionId] = null;
		socket.join('loggedInUser', () => {
			
		});

		socket.emit('rooms', buildRespRooms(sessionList[socketId].accountId));
	}else{
		sessionList[socketId] = {'accountId':null};
	}
  var session = sessionList[socketId];
	console.log('session:'+JSON.stringify(session));

  function loginFilter(callback){
    console.log('session:'+JSON.stringify(session));
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
    loginFilter(function(bookings, resp){
      var success = false;
      try {
        bookings.forEach(function(booking){
          var room = findRoom(booking.roomId);
					var timeSlot = findTimeSlot(room, booking.timeSlotId);
          if(timeSlot){
            if(timeSlot.isBooked && timeSlot.accountId == session.accountId){
              timeSlot.isBooked = false;
            }else if(!timeSlot.isBooked){

              timeSlot.isBooked = true;
              timeSlot.accountId = session.accountId;
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
