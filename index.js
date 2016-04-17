var express = require('express');
var app = express();
var pg = require('pg').native ;
var connectionString = process.env.DATABASE_URL ;
var start = new Date() ;
var server = require('http').Server(app);
var  port = process.env.PORT ||8080;
var io = require('socket.io')(server);
var client;
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

client = new pg.Client(connectionString);
client.connect();
app.use(express.cookieParser()); //just for auth
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(passport.session());
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

server.listen(port, function() {
  console.log('Listening on:', port);
});

//login stuff
app.get('/signin', function ( req,res){
  res.sendfile(__dirname +'/signin.html');
});

app.get('/signup', function ( req,res){
  res.sendfile(__dirname +'/signup.html');
});

app.post('/signup',function(req, res){
  var un = req.body.username;
  var pw = req.body.password;
  var query = client.query('SELECT COUNT(username) FROM users u WHERE u.username = $1 AND password = $2' , [un, pw],function(err){
    if(err) {console.log("singup fail ") ; }
    res.end() ;
  });


}) ;

app.post('/signin',
  passport.authenticate('local', { failureRedirect: '/signin' }),
  function(req, res) {
    res.redirect('/');
  });

  app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });
// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.

passport.use(new Strategy(
  function(username, password, cb) {
    console.log("strategy");
    findByUsername(username, function(err, user) {
      if (err) { console.log('err') ; return cb(err); }
      if (!user) { console.log('!user') ;return cb(null, false); }
      if (user.password != password) { console.log('!pass' + user.password) ;return cb(null, false); }

      return cb(null, user);
    });
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.username);
});

passport.deserializeUser(function(id, cb) {
  findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});
/*
findByUsername = function(username , cb){//
  console.log('findByUsername ' + username);
  var query =   client.query ( 'SELECT username FROM account WHERE username =$1' ,[username]);
    query.on('row' , function (res){
      if(!res){ console.log('fail ') ;  cb(null, null );}
      else { console.log('success ') ; cb(null, res) ; }
    });
}*/
findByUsername = function(username , cb){//
  console.log('findByUsername ' + username );
  var query =   client.query ( 'SELECT username , count(username) as count FROM account WHERE username =$1 GROUP BY USERNAME' ,[username]);
console.log('findByUsername2 ' + username );
  query.on('err' , function(err) {
    console.log("Error occured" ) ;
    cb(null, null );
  });
  query.on('row', function(result){
    console.log("success : "+result.username + result.password) ;
    cb(null, null);
  });
  query.on('end' , function(result){
    if(result.count <1 ){
      console.log("no user");
      cb(null, null);
    }
    else {
      cb (null, result);
    }

  });

}
