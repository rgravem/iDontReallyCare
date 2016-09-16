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
    }//end else
  });//end connect
});//end changeTableStatus

app.post('/changeServer', urlEncodedParser, function(req, res){
  console.log('changeServer hit');
  //expecting a table and a server id
  var data = {serverId: req.body.serverId, tableId: req.body.tableId};
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }
    else{
      client.query('UPDATE dinner_table SET server_id=($1) WHERE id=($2)', [data.serverId, data.tableId]);
      var resultQuery = client.query(`SELECT * FROM dinner_table WHERE id=${data.tableId}`);
      var resultArray = [];
      resultQuery.on('row', function(row){
        resultArray.push(row);
      });
      resultQuery.on('end', function(){
        done();
        return res.json(resultArray);
      });
    }//end else
  });//end connect
});

app.post('/addServer', urlEncodedParser, function(req,res){
  console.log('in addServer');
  pg.connect(connectionString, function(err,client,done){
    if(err){
      console.log(err);
    }//end if
    else{
      console.log('connected to database for addServer');
      var resultArray = [];
      var queryResults = client.query('INSERT INTO server (first_name, last_name) VALUES ($1,$2) RETURNING *;',
      [req.body.first_name, req.body.last_name]);
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
      var resultArray =[];
      var queryResults = client.query('INSERT INTO dinner_table (table_name, capacity, status) VALUES ($1,$2,$3) RETURNING *;', [req.body.table_name, req.body.capacity, req.body.status]);
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

app.post('/deleteServer', urlEncodedParser, function(req, res){
  console.log('delete server hit');

  var data = {
    id: req.body.id
  };
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }
    else{
      client.query('DELETE FROM server WHERE id=$1', [data.id]);
      var resultQuery = client.query(`SELECT * FROM server`);
      var resultArray = [];
      resultQuery.on('row', function(row){
        resultArray.push(row);
      });
      resultQuery.on('end', function(){
        done();
        return res.json(resultArray);
      });
    }//end else
  });//end connect
});

app.post('/deleteTable', urlEncodedParser, function(req, res){
  console.log('delete table hit');

  var data = {
    id: req.body.id
  };
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }
    else{
      client.query('DELETE FROM dinner_table WHERE id=$1', [data.id]);
      var resultQuery = client.query(`SELECT * FROM dinner_table`);
      var resultArray = [];
      resultQuery.on('row', function(row){
        resultArray.push(row);
      });
      resultQuery.on('end', function(){
        done();
        return res.json(resultArray);
      });
    }//end else
  });//end connect
});

app.use(express.static('public'));
