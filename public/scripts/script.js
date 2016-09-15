console.log('script sourced');

// arrays
var tables=[];
 var employees=[];
var newEmployee ={};

$(document).ready(function(){
  console.log('JQ works');
  //get employees and tables on load
  $.ajax({
      type:"get",
      url: '/getServer',
      success: function(data){
        console.log("back from the server with:", data);
        listEmployees(data);
      }//end success
  });// end getServer ajax
  $.ajax({
      type:"get",
      url: '/getAllTables',
      success: function(data){
        console.log("back from the server with:", data);
        listTables(data);
      }//end success
  });// end getServer ajax



  // add employee on click
  $('#createEmployee').on('click',function(){
    //verify click is working
    console.log("in createEmployee on click");
    createEmployee();
    //send employee info to the server
    $.ajax({
      type:"POST",
      url: '/addServer',
      data: newEmployee,
      success: function(data){
        console.log("ajax success back with:", data);
        //display  employees in employeesOutput
        listEmployees(data);
        // push into employees array
        employees.push(data);
      }//end success
    });//end ajax /addServer call
  });//end createEmployee on click

  //add table on click
$('#createTable').on('click', function(){
  //verify click is working
  console.log("in createTable on click");
});
  //display current employees

  // display current tables

});//end doc ready

var createEmployee = function(){
  console.log( 'in createEmployee' );
  // get user input
  var employeeFirstName = $( '#employeeFirstNameIn' ).val();
  var employeeLastName = $( '#employeeLastNameIn' ).val();
  // create object for employee
  newEmployee= {
    firstName : employeeFirstName,
    lastName : employeeLastName
  }; // end object

}; // end createEmployee

var createTable = function(){
  console.log( 'in createTable' );
  // get user input
  var tableName = $('#nameIn').val();
  var tableCapacity = $('#capacityIn').val();
  // table object for new table
  var newTable = {
    'name': tableName,
    'capacity': tableCapacity,
    'server': -1,
    'status': 'empty'
  };
  // push new obejct into tables array
  tables.push( newTable );
  console.log( 'added table: ' + newTable.name );
  // update output
  listTables();
}; // end createTable

var cycleStatus = function( index ){
  console.log( 'in cycleStatus: ' + index );
  // move table status to next status
  switch( tables[index].status ){
    case  'empty':
        tables[index].status = 'seated';
        break;
    case  'seated':
        tables[index].status = 'served';
        break;
    case  'served':
        tables[index].status = 'dirty';
        break;
    case  'dirty':
    break;
    default:
      tables[index].status = 'empty';
  }
  // show tables on DOM
  listTables();
}; // end cycleStatus

var listEmployees = function(data){
  var addLineText;
  var closing;
  console.log( 'in listEmployees', employees );
  $('#employeesOutput').html('<ul>');
  // loop through the tables array and display each table
  for( i=0; i< data.length; i++ ){
    var line = data[i].first_name + " " + data[i].last_name + ', id: ' + data[ i ].id;

    //add line text
    addLineText += '<li>' + line + '</li>';
    // add line to output div
    $('#employeesOutput').html(addLineText);
  }
  // add closing UL text
  closing += '</ul>';
  //add closing UL
  $('#employeesOutput').html(closing);
  // update tables display
  listTables();
}; // end listEmployees

var listTables = function(data){
  var outputText;
  console.log( "in listTables" );
  // target our output div
  $('#tablesOutput').html("");
  // loop through the tables array and display each table

  // select to assign a server to this table
  var selectText = '<select>';
  for (var i = 0; i < employees.length; i++) {
    selectText+= '<option value=' + i + '>'+ employees[i].firstName + ' ' + employees[i].lastName + '</option>';
  }
  selectText += '</select>';
  // display employees
  for( i=0; i< data.length; i++ ){
    // status is a button that, when clicked runs cycleStatus for this table
    var line = data[i].name + " - capacity: " + data[i].capacity + ', server: ' + selectText + ', status: <button onClick="cycleStatus(' + i + ')">' + data[i].status + "</button>";
    // add line to output div
    outputText += '<p>' + line + '</p>';
    $('#tablesOutput').html(outputText);
  }
}; // end listTables
