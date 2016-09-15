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

app.use(express.static('public'));


app.post('/addServer', urlEncodedParser, function(req,res){
  console.log('in addServer');
  pg.connect(connectionString, function(err,client,done){
    if(err){
      console.log(err);
    }//end if
    else{
      console.log('connected to database for addServer');
      var queryResults = client.query('INSERT INTO server (first_name, last_name) VALUES ($1,$2) ',
      [req.body.first_name, req.body.last_name],
      done());
    }//end else
  });//end pg
});//end /addServer

app.get('/getServer', function(req,res){
  console.log('in getServer');
  pg.connect(connectionString, function(err,client,done){
    if(err){
      console.log(err);
    }//end if
    else{
      console.log('connected to database for getServer');
      //result array
      var resultArray =[];
      var queryResults = client.query('SELECT * FROM server');
      queryResults.on('row', function(row){
        resultArray.push(row);
        console.log(resultArray);
      });//end queryResults on row
      queryResults.on('end', function(){
        done();
        return res.json(resultArray);
      });//end queryResults on end
    }//end else
  });//end pg
});//end /getServer



app.post('/addTable', urlEncodedParser, function(req,res){
  console.log('in addTable');
  pg.connect(connectionString, function(err,client,done){
    if(err){
      console.log(err);
    }//end if
    else{
      console.log('connected to database for addTable');
      var queryResults = client.query('INSERT INTO dinner_table (capacity, status, server_id) VALUES ($1,$2,$3) ',
      [req.body.capacity, req.body.status, req.body.server_id],
      done());
    }//end else
  });//end pg
});//end /addTable


app.get('/getAllTables', function(req,res){
  console.log('in getAllTables');
  pg.connect(connectionString, function(err,client,done){
    if(err){
      console.log(err);
    }//end if
    else{
      console.log('connected to database for getAllTables');
      //result array
      var resultArray =[];
      var queryResults = client.query('SELECT * FROM dinner_table');
      queryResults.on('row', function(row){
        resultArray.push(row);
        console.log(resultArray);
      });//end queryResults on row
      queryResults.on('end', function(){
        done();
        return res.json(resultArray);
      });//end queryResults on end
    }//end else
  });//end pg
});//end getAllTables
