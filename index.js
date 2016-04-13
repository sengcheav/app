var express = require('express')
  , app = express()
  , port = process.env.PORT ||8080

 ,server = require('http').Server(app)
 //, http = require ('http').Server(app)
  //, io = require('socket.io')(http)
  var io = require('socket.io')(server);

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
