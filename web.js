var express = require('express')
  , app = express()
  , pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , start = new Date()
  , port = process.env.PORT
  , http = require ('http').Server(app)
 // , server = require('http').createServer(app)
  , io = require('socket.io')(http)
  , client;
  //, app = express.createServer(express.logger())
client = new pg.Client(connectionString);
client.connect();

io.configure('development', function(){
  io.set('transports', ['xhr-polling']);
});

app.get('/1', function(req, res) {
  var date = new Date();

  client.query('INSERT INTO visits(date) VALUES($1)', [date]);

  query = client.query('SELECT COUNT(date) AS count FROM visits WHERE date = $1', [date]);
  query.on('row', function(result) {
    console.log(result);

    if (!result) {
      return res.send('No data found');
    } else {
		console.log('vistit today '+ result.count);
      res.send('Visits today: ' + result.count);
    }
  });
});

app.get('/', function(req, res){
  res.sendfile(__dirname +'/index.html');
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
