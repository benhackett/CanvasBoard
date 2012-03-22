var io = require('socket.io').listen(5000);

io.sockets.on('connection', function(socket) {	
	console.log('Browser has websocket.  Details:'+socket);
});