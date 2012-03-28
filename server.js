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

//The buffer will be the last n user paths. 
//New users will be sent the buffer so they see the previous n paths immedietly.
var buffer = []; 

io.sockets.on('connection', function(socket) {
	
	socket.json.send({ buffer: buffer });
    socket.json.broadcast.emit('UserConnected', "User " + socket.id + " connected.");

    socket.on('drawPath', function(message){
        var msg = { message: [socket.id, message] };
        buffer.push(msg);
        if (buffer.length > 300){
	        buffer.shift();	
        } 
        socket.json.broadcast.emit(msg);
    });

    socket.on('clientPath', function(data){
    	socket.json.broadcast.emit('serverPath', data);
    });

    socket.on('disconnect', function(){
        socket.json.broadcast.emit("UserDisconnected", "User " + socket.id + ' disconnected.');
    });
});

serve.listen(4000);