console.log('script sourced');

// arrays
var tables=[];
var employees=[];
var statuses =['empty', 'seated', 'served', 'dirty']
var statusSelector = '<select class="statusSelector"><option>Select</option><option>empty</option><option>seated</option><option>served</option><option>dirty</option>';
var selectText = '';


$(document).ready(function(){
  console.log('JQ works');
  //get employees and tables on load
  $.ajax({
      type:"get",
      url: '/getServer',
      success: function(data){
        console.log("back from the server with:", data);
        for (var i = 0; i < data.length; i++) {
          employees.push(data[ i ]);
        }
        listEmployees(data);
        $.ajax({
            type:"get",
            url: '/getAllTables',
            success: function(table){
              console.log("back from the server with:", table);
              tables.push(table);
              listTables(tables[0]);
            }//end success
        });// end getTables ajax
      }//end success
  });// end getServer ajax


  // add employee on click
  $('#createEmployee').on('click',function(){
    //verify click is working
    console.log("in createEmployee on click");
    var newEmployee = createEmployee();
    //send employee info to the server
    $.ajax({
      type:"POST",
      url: '/addServer',
      data: newEmployee,
      success: function(data){
        console.log("ajax success back with:", data);
        //display  employees in employeesOutput
        employees.push(data[0]);
        listEmployees(employees);
        // push into employees array

      }//end success
    });//end ajax /addServer call
  });//end createEmployee on click

  //add table on click
  $('#createTable').on('click', function(){
    //verify click is working
    console.log("in createTable on click");
    var newTable=createTable();
    $.ajax ({
      type:"POST",
      url: '/addTable',
      data: newTable,
      success: function(data){
        console.log('ajax success back with:', data);
        tables[0].push(data[0]);

        listTables(tables[0]);

      }//end success
    });//end ajax
  });//end createTable on click


  // display current tables
  $('body').on('click', '.tableStatus', function(){
    $(this).replaceWith(statusSelector);
  });
  $('body').on('change', '.statusSelector', function(){
    //status, id
    // console.log();
    var objectToSend = {
      status: $(this).val(),
      id: tables[0][$(this).parent().attr('id').charAt($(this).parent().attr('id').length-1)].id
    };
    //change client side table status
    tables[0][$(this).parent().attr('id').charAt($(this).parent().attr('id').length-1)].status = objectToSend.status;

    console.log(objectToSend);

    $.ajax({
      url: '/changeTableStatus',
      type: 'POST',
      data: objectToSend,
      success: function(data){
        listTables(tables[0]);
      }
    })
  })//end statusSelector onChange
  $('body').on('click', '.currentServer', function(){
    $(this).replaceWith(selectText);
  });//end currentServer on click

  $('body').on('change', '.serverSelect', function(){
    var objectToSend = {
      serverId: employees[$(this).val()].id,
      tableId:  tables[0][$(this).parent().attr('id').charAt($(this).parent().attr('id').length-1)].id
    };
    //update table in tables array
    tables[0][$(this).parent().attr('id').charAt($(this).parent().attr('id').length-1)].server_id = employees[$(this).val()].id
    $.ajax({
      url: '/changeServer',
      type: 'POST',
      data: objectToSend,
      success: function(data){
        //do stuff
        listTables(tables[0]);
      }
    })
  });//end serverSelect on change

  $('body').on('click', '.deleteServer', function(){
    var objectToSend = {
      id: $(this).val()
    }
    $.ajax({
      url: 'deleteServer',
      type: 'POST',
      data: objectToSend,
      success: function(data){
        location.reload();
      }
    })
  })//end .deleteServer onClick

  $('body').on('click', '.deleteTable', function(){
    var objectToSend = {
      id: $(this).val()
    }
    $.ajax({
      url: 'deleteTable',
      type: 'POST',
      data: objectToSend,
      success: function(data){
        location.reload();
      }
    })
  })//end .deleteTable onClick
});//end doc ready

var createEmployee = function(){
  console.log( 'in createEmployee' );
  var newEmployee ={};
  // get user input
  var employeeFirstName = $( '#employeeFirstNameIn' ).val();
  var employeeLastName = $( '#employeeLastNameIn' ).val();
  // create object for employee
  newEmployee= {
    first_name : employeeFirstName,
    last_name : employeeLastName
  }; // end object
  return newEmployee;
}; // end createEmployee

var createTable = function(){
  console.log( 'in createTable' );
  // get user input
  var tableName = $('#nameIn').val();
  var tableCapacity = $('#capacityIn').val();
  // table object for new table
  var newTable = {
    'table_name': tableName,
    'capacity': tableCapacity,
    'status': 'empty'
  };
  return newTable;
}; // end createTable

// var cycleStatus = function( index ){
//   console.log( 'in cycleStatus: ' + index );
//   // move table status to next status
//   switch( tables[index].status ){
//     case  'empty':
//         tables[index].status = 'seated';
//         break;
//     case  'seated':
//         tables[index].status = 'served';
//         break;
//     case  'served':
//         tables[index].status = 'dirty';
//         break;
//     case  'dirty':
//     break;
//     default:
//       tables[index].status = 'empty';
//   }
//   // show tables on DOM
//   listTables();
// }; // end cycleStatus

var listEmployees = function(data){
  var addLineText ='';
  console.log( 'in listEmployees');

  // loop through the tables array and display each table
  for( i=0; i< data.length; i++ ){
    var line = data[i].first_name + " " + data[i].last_name + ' <button class="deleteServer" value="' + data[i].id + '">Fire</button>';

    //add line text
    addLineText += '<li>' + line + '</li>';
  }
  //update display employees
  $('#employeesOutput').html("<ul>"+addLineText + "</ul>");
  //update global selector html string
  selectText = '<select class="serverSelect"><option>Select Server</option>';
  for (var i = 0; i < employees.length; i++) {
    selectText+= '<option value=' + i + '>'+ employees[i].first_name + ' ' + employees[i].last_name + '</option>';
  }
  selectText += '</select>';
}; // end listEmployees

var listTables = function(table){
  var outputText = '';
  console.log( "in listTables" );

  // loop through the tables array and display each table

  // select to assign a server to this table
  console.log("employees array in display tables:", employees);

  // display employees
  console.log("data before for loop", table);
  for( i=0; i< table.length; i++ ){
    var server = false;
    if (table[i].server_id){
      for (var n = 0; n < employees.length; n++) {
        if (employees[n].id === table[i].server_id){
          server = employees[n];
        }
      }
    }
    var currentServer = 'None';
    if (server){
      currentServer = server.first_name + ' ' + server.last_name;
    }
    // status is a button that, when clicked runs cycleStatus for this table
    var line = table[i].table_name + " - capacity: " + table[i].capacity + ', server: <ins class="currentServer" style="display: inline;">' + currentServer + '</ins>, status: <ins class="tableStatus" style="display: inline;">' + table[i].status + '</ins> <button class="deleteTable" value="' + table[i].id + '">Burn</button>';
    // add line to output div
    outputText += '<p id="table' + i + '">' + line + '</p>';
    $('#tablesOutput').html(outputText);
  }
  // console.log(outputText);
}; // end listTables
