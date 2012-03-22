var express = require('express');

var serve = express.createServer();
var io = require('socket.io').listen(5000);
var _ = require('underscore')._;

serve.configure(function() {
	serve.use(express.static(__dirname + '/static'));
});

serve.get('/',function(req,res) {
	res.send("howdy draw");
	console.log('howdy server');
});

io.sockets.on('connection', function(socket) {	
	socket.on('drawClick', function(data) {
      socket.broadcast.emit('draw', {
        x: data.x,
        y: data.y,
        type: data.type
      });
    });
});

serve.listen(4000);