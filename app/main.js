var express = require('express');
var app = express();
var http = require('http').Server(app);
var ioBrowser = require('socket.io')(http);



app.use(express.static(__dirname+'/client-side'));




var selfPort = process.argv[2] || 3000;
var remotePort = process.argv[3] || 13000;
process.argv.forEach(function(val, index, array){
	console.log(index+': '+val);
});

var serverStatus = 'pending';

var serverSocketList = [];
var io = require('socket.io')(selfPort);
io.set('transports', ['websocket']);

//access point for other server
io.on('connection', function (serverSocket) {

		serverSocketList.push(serverSocket);
		serverSocket.on('serverStatus', function(req, resp){
			resp({status:serverStatus})
		});
});


//sync data to backup server
setInterval(function(){
	if (serverStatus =='main') {
		for(let i =0; i<serverSocketList.length; i++){
			var backupServer = serverSocketList[i];
			backupServer.emit('syncAccountList', accountList, function(data){
				console.log('emit syncAccountList response:'+JSON.stringify(data));
			});
			backupServer.emit('syncSessionList', sessionList, function(data){
				console.log('emit syncSessionList response:'+JSON.stringify(data));
			});
			backupServer.emit('syncRoomsList', rooms, function(data){
				console.log('emit syncRoomsList response:'+JSON.stringify(data));
			});
		}
	}
}, 1000);


//connect to other server
var remoteServerSocket = require('socket.io-client').connect('http://localhost:'+remotePort, {
    reconnection: true,
		transports: ['websocket']
});
remoteServerSocket.on('connect', function () {
	console.log('connectioned to another server');


	//query server mode from other server
	remoteServerSocket.emit('serverStatus', {}, function(data){
		console.log('remote server status:'+JSON.stringify(data));
		if (data.status == 'main') {
			console.log('another server is main server');
			console.log('set self status to "backup"');
			serverStatus = 'backup';
			bindSyncFunction();
		}
	});

	function bindSyncFunction(){
		remoteServerSocket.on('syncAccountList', function(data){

			accountList = data;
		});
		remoteServerSocket.on('syncSessionList', function(data){
			console.log('syncSessionList from main server');
			console.log(data);
			sessionList = data;
		});
		remoteServerSocket.on('syncRoomsList', function(data){
			console.log('syncRoomsList from main server');
			// console.log(data);
			data.forEach(function(item) {
				console.log(item);
			})
			rooms = data;
		});
	}
});
//detect other server has connect error, if yes, then switch this server to Primary server
remoteServerSocket.on('connect_error', function() {
    console.log('Failed to connect to server');
		console.log('set self status to "main"');
		if (serverStatus != 'main') {
			http.listen('38080', function(){
				console.log('listening on *:'+38080);
			});
		}
		serverStatus = 'main';
});
//detect other server is disconnet, if yes, then switch this server to Primary server
remoteServerSocket.on('disconnect', function(){
	console.log('remoteServerSocket discounnect');
	console.log('set self status to "main"');
	if (serverStatus != 'main') {
		http.listen('38080', function(){
			console.log('listening on *:'+38080);
		});
	}
	serverStatus = 'main';
})







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



function buildRespRooms(accountId){
  let respRooms = rooms.slice(0);//clone array
  respRooms.forEach(function(room){

		room.timeSlots.forEach(function(timeSlot){
			timeSlot.canCancel = (timeSlot.accountId == accountId) && timeSlot.isBooked;
		})
  });
  return respRooms;
}

function broadcastRooms(){
  var clients = io.sockets.adapter.rooms['loggedInUser'].sockets;

  console.log('broadcastRooms');
  for (var clientId in clients ) {
    //this is the socket of each client in the room.
    var client = io.sockets.connected[clientId];
    console.log('clientId:'+client.id);

    if(sessionList[client.id]){
      var accountId = sessionList[client.id].accountId;
      console.log('accountId:'+accountId);

      client.emit('rooms', buildRespRooms(sessionList[client.id].accountId));
    }

  }
}



function findCookieSessionId(cookieStr){
	var cookies = cookieStr?cookieStr.split(';'):[];
	for(var i=0,length=cookies.length;i<length;i++){
		var cookiePair = cookies[i].split(/=(.+)/);
		if(cookiePair[0].trim() == 'token'){
			return cookiePair[1].trim();
		}
	}
	return null;
}


//client function access point
io.on('connection', function(socket){
	console.log(socket.handshake.headers.cookie);
	var clientSessionId = findCookieSessionId(socket.handshake.headers.cookie)
	console.log('client existing session id:'+clientSessionId+'; session:'+(sessionList[clientSessionId] && JSON.stringify(sessionList[clientSessionId])));

  var socketId = socket.id;
	console.log('new session id:'+socketId);

	if (clientSessionId && sessionList[clientSessionId]) {
		//recovery session
		console.log('recovery session');
		sessionList[socketId] = sessionList[clientSessionId];
		socket.join('loggedInUser', () => {

		});

		socket.emit('rooms', buildRespRooms(sessionList[socketId].accountId));
		socket.emit('token', socketId);

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



	//login function
  socket.on('login', function(loginAccount, resp){
    console.log('login');
    console.log('socketId:'+socketId);
    console.log(loginAccount);
    var success = false;

		//sync the token when user login at the same browser twice times in different tabs
    accountList.forEach(function(account) {
      if(account.id===loginAccount.id && account.password === loginAccount.password){
        success = true;
        session.accountId = loginAccount.id;

        sessionList[socketId] = session;


        var allConnectedSockets = io.sockets.connected;


        for (var connectedSocketId in allConnectedSockets) {

            var connectedSocket = allConnectedSockets[connectedSocketId];

            if(sessionList[connectedSocketId]){
              var accountId = sessionList[connectedSocketId].accountId;
              console.log('accountId:'+accountId);

              if(accountId == session.accountId){
                connectedSocket.join('loggedInUser', () => {

                });
								if (serverStatus == 'main') {
									connectedSocket.emit('token', socketId);
								}
              }

            }

        }




        socket.emit('rooms', buildRespRooms(session.accountId));
        return;
      }
    }, this);
    wrapResp(resp, success);

  });


	//booking function access point
  socket.on('rooms-update', function(req, resp){
    console.log('rooms-update')
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

        broadcastRooms();
      } catch (error) {
        console.log(error);
      }

      wrapResp(resp, success);
    })(req, resp);
  });

	//query rooms data function access point
  socket.on('rooms', function(req, resp){
    loginFilter(function(req, resp){
      resp(buildRespRooms(session.accountId));
    })(req, resp);
  });

});
