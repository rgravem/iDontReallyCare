console.log('script sourced');

// arrays
var tables=[];
var employees=[];

$(document).ready(function(){
  console.log('JQ works');

  // add employee on click
  $('#createEmployee').on('click',)

  //add table on click
$('#createTable')
  //display current employees

  // display current tables

});//end doc ready

var createEmployee = function(){
  console.log( 'in createEmployee' );
  // get user input
  var employeeFirstName = $( '#employeeFirstNameIn' ).val();
  var employeeLastName = $( '#employeeLastNameIn' ).val();
  // create object for employee
  var newEmployee= {
    firstName : employeeFirstName,
    lastName : employeeLastName
  }; // end object
  // push into employees array
  employees.push( newEmployee );
  // update display
  listEmployees();
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

var listEmployees = function(){
  var addLineText;
  var closing;
  console.log( 'in listEmployees', employees );
  $('#employeesOutput').html('<ul>');
  // loop through the tables array and display each table
  for( i=0; i< employees.length; i++ ){
    var line = employees[i].firstName + " " + employees[i].lastName + ', id: ' + i;

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

var listTables = function(){
  var outputText;
  console.log( "in listTables" );
  // target our output div
  document.getElementById('tablesOutput').innerHTML = '';
  // loop through the tables array and display each table

  // select to assign a server to this table
  var selectText = '<select>';
  for (var i = 0; i < employees.length; i++) {
    selectText+= '<option value=' + i + '>'+ employees[i].firstName + ' ' + employees[i].lastName + '</option>';
  }
  selectText += '</select>';
  // display employees
  for( i=0; i< tables.length; i++ ){
    // status is a button that, when clicked runs cycleStatus for this table
    var line = tables[i].name + " - capacity: " + tables[i].capacity + ', server: ' + selectText + ', status: <button onClick="cycleStatus(' + i + ')">' + tables[i].status + "</button>";
    // add line to output div
    outputText += '<p>' + line + '</p>';
    $('#tablesOutput').html(outputText);
  }
}; // end listTables
