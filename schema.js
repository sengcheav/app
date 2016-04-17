var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
//query = client.query('CREATE TABLE visits (date date)');
query = client.query('CREATE TABLE account (username VARCHAR(10) PRIMARY KEY , password VARCAHR(10) )');
query.on('end', function(result) { client.end(); });
