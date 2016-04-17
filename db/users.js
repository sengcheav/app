

exports.findByUsername = function(username , cb){
  process.nextTick(function() {
  client.query ( 'SELECT username FROM account WHERE username =$1' ,[username]);
  query.on('row' , function (res){
    if(!res){ console.log('fail ') ;  cb(null, null );}
    else { console.log('success ') ; cb(null, res) ; }
  });

});
}
