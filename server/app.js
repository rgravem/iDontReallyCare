var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended: false});
var path = require('path');
var pg = require('pg');

var connectionString = 'postgres://localhost:5432/iDontReallyCare';

app.listen('3000', function(){
  console.log('listening on port 3000');
});

app.get('/', function(req, res){
  console.log('base URL hit');
  res.sendFile(path.resolve('public/index.html'));
});

app.post('/changeTableStatus', urlEncodedParser, function(req, res){
  console.log('tableStatus hit');
  //expecting a table and a status
  var data = {status: req.body.status, id: req.body.id};
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }
    else{
      client.query('UPDATE dinner_table SET status=($1) WHERE id=($2)', [data.status, data.id]);
      var resultQuery = client.query(`SELECT * FROM dinner_table WHERE id=${data.id}`);
      var resultArray = [];
      resultQuery.on('row', function(row){
        resultArray.push(row);
      });
      resultQuery.on('end', function(){
        done();
        return res.json(resultArray);
      });
    }
  });
});

app.post('/changeServer', urlEncodedParser, function(req, res){
  console.log('changeServer hit');
});

app.use(express.static('public'));
