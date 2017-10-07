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

var accountList = [{'id':'test', 'password':'pwd'}];
var rooms = [
  {'id':'1', 'code':'001', 'isBooked':false}
,{'id':'2', 'code':'002', 'isBooked':false}
,{'id':'3', 'code':'003', 'isBooked':false}
,{'id':'4', 'code':'004', 'isBooked':false}
,{'id':'5', 'code':'005', 'isBooked':false}
,{'id':'6', 'code':'006', 'isBooked':false}
]

function wrapResp(resp, success, message, data){
  resp({'success':success, 'message':message, 'data':data});
}


io.on('connection', function(socket){
  
  console.log('a user connected');

  // socket.broadcast.emit('hi');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  // socket.on('client', function(msg){
  //   console.log('message: ' + msg);
  // });

  socket.on('login', function(loginAccount, resp){
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
        return;
      }
    }, this);
    wrapResp(resp, success);

    rooms[0].isBooked = true;
    // socket.emit('rooms', rooms);
    io.sockets.emit('rooms', rooms);
  });

  socket.on('rooms-update', function(newRooms, resp){
    var success = false;
    try {
      newRooms.forEach(function(newRoom){
       rooms.forEach(function(room){
          if(room.id == newRoom.id){
            room.isBooked = newRoom.isBooked;
            return;
          }
        });
      });
    } catch (error) {
      console.log(error);
    }

    io.sockets.emit('rooms', rooms);
    wrapResp(resp, success);
  })

  socket.on('rooms', function(req, resp){
    resp(rooms);
  });

});