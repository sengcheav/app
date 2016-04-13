//var app = require('express')();
//var http = require('http').Server(app);//
//var io = require('socket.io')(http);


var express = require('express')
  , app = express()
//  , pg = require('pg').native
//  , connectionString = process.env.DATABASE_URL
  //, start = new Date()
  , port = process.env.PORT ||8080
  , http = require ('http').Server(app)
 // , server = require('http').createServer(app)
  , io = require('socket.io')(http)
  , client;
  //, app = express.createServer(express.logger())
//client = new pg.Client(connectionString);
//client.connect();
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
