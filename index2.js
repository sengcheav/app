var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT ||8080;
var io = require('socket.io')(http);

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

http.listen(port, function(){
  console.log('listening on *:3000');
});
//var server = app.listen(process.env.PORT, function() {
  //  console.log('Listening on port %d', server.address().port);
//});
