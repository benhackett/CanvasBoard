(function() {
  var whereAreWeHosted = 'http://localhost:5000';
  var CanvasApp;
  CanvasApp = {};
  /*
  	Init 
  */
  CanvasApp.init = function() {
    CanvasApp.canvas = document.createElement('canvas');
    CanvasApp.canvas.height = 400;
    CanvasApp.canvas.width = 800;
    document.getElementsByTagName('article')[0].appendChild(App.canvas);
    CanvasApp.ctx = App.canvas.getContext("2d");
    CanvasApp.ctx.fillStyle = "solid";
    CanvasApp.ctx.strokeStyle = "#ECD018";
    CanvasApp.ctx.lineWidth = 5;
    CanvasApp.ctx.lineCap = "round";
    CanvasApp.socket = io.connect(whereAreWeHosted);
    CanvasApp.socket.on('draw', function(data) {
      return CanvasApp.draw(data.x, data.y, data.type);
    });
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
  $('canvas').live('drag dragstart dragend', function(e) {
    var offset, type, x, y;
    type = e.handleObj.type;
    offset = $(this).offset();
    e.offsetX = e.layerX - offset.left;
    e.offsetY = e.layerY - offset.top;
    x = e.offsetX;
    y = e.offsetY;
    CanvasApp.draw(x, y, type);
    CanvasApp.socket.emit('drawClick', {
      x: x,
      y: y,
      type: type
    });
  });
  $(function() {
    return CanvasApp.init();
  });
}).call(this);