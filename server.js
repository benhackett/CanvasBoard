var io = require('socket.io').listen(5000);

io.sockets.on('connection', function(socket) {	
	socket.on('drawClick', function(data) {
      socket.broadcast.emit('draw', {
        x: data.x,
        y: data.y,
        type: data.type
      });
    });
});