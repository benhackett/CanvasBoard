(function() {
	var whereAreWeHosted = 'http://localhost:5000';
	var CanvasApp;
	CanvasApp = {};

	CanvasApp.init = function() {
		CanvasApp.canvas = document.createElement('canvas');
		CanvasApp.canvas.height = 400;
		CanvasApp.canvas.width = 900;
		document.getElementsByTagName('article')[0].appendChild(CanvasApp.canvas);
		CanvasApp.ctx = CanvasApp.canvas.getContext("2d");
		CanvasApp.ctx.fillStyle = "solid";
		CanvasApp.ctx.strokeStyle = "#05761b";
		CanvasApp.ctx.lineWidth = 2;
		CanvasApp.ctx.lineCap = "round";
		CanvasApp.socket = io.connect(whereAreWeHosted);
		
		CanvasApp.socket.on('message', function(data) {
			// console.log(data);
		});

		CanvasApp.socket.on('UserConnected', function(data){
			// console.log(data);
		});

		CanvasApp.socket.on('serverPath', function(data){
			CanvasApp.drawPath(data);
		});

		CanvasApp.drawPath = function(pts){
			CanvasApp.ctx.beginPath();
			for(var i = 0; i < pts.length; i++){
				CanvasApp.ctx.lineTo(pts[i].x, pts[i].y);
				CanvasApp.ctx.stroke();
			}
			CanvasApp.ctx.closePath();
		}

		CanvasApp.draw = function(x, y, type) {
			if (type === "dragstart") {
				CanvasApp.ctx.beginPath();
				return CanvasApp.ctx.moveTo(x, y);
			} else if (type === "drag") {
				CanvasApp.ctx.lineTo(x, y);
				return CanvasApp.ctx.stroke(); 
			} else {
				return CanvasApp.ctx.closePath();
			}
		};
	};

	// points is an array of x and y coordinates used to draw a line.
	// Currently only planning on storing 3 points before I draw a segment and 
	// send it to the server, the user probably won't notice the 'lag' of waiting
	// to draw and it eases up the traffic on the server a bit.
	var points = []; 

	$('canvas').live('drag dragstart dragend', function(e) {
		var offset, type, x, y;
		type = e.handleObj.type;
		offset = $(this).offset();
		e.offsetX = e.layerX - offset.left;
		e.offsetY = e.layerY - offset.top;
		x = e.offsetX;
		y = e.offsetY;

		points.push({x: x, y: y});
		
		if(points.length == 6){
			var pts = points.splice(0, 6);
			CanvasApp.drawPath(pts);
			CanvasApp.socket.emit('clientPath', pts);
		}

		if(type === "dragend") {
			CanvasApp.drawPath(points);
			points.splice(0, points.length);
			CanvasApp.socket.emit('clientPath', points);
		}
	});

	$(function() {
		return CanvasApp.init();
	});
}).call(this);
