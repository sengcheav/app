var express = require('express');
var  app = express();
var server = require('http').Server(app);
var  port = process.env.PORT ||8080;
var io = require('socket.io')(server);

 //, http = require ('http').Server(app)
  //, io = require('socket.io')(http)


//  , client;

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

app.listen(port, function() {
  console.log('Listening on:', port);
});
