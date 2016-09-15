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
