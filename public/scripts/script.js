console.log('script sourced');

// arrays
var tables=[];
var employees=[];
var statuses =['empty', 'seated', 'served', 'dirty']
var statusSelector = '<select class="statusSelector"><option>empty</option><option>seated</option><option>served</option><option>dirty</option>';

$(document).ready(function(){
  console.log('JQ works');
  //get employees and tables on load
  $('#currentEmployees').on('click', function(){
    $.ajax({
        type:"get",
        url: '/getServer',
        success: function(data){
          console.log("back from the server with:", data);
          listEmployees(data);
          for (var i = 0; i < data.length; i++) {
            employees.push(data[ i ]);
          }
        }//end success
    });// end getServer ajax
  });// end on click

  $('#currentTables').on('click', function(){

    $.ajax({
        type:"get",
        url: '/getAllTables',
        success: function(table){
          console.log("back from the server with:", table);
          listTables(table);
        }//end success
    });// end getTables ajax
  });//end on click



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
  $('body').on('click', '.tableStatus', function(){
    $(this).replaceWith(statusSelector);
  });
  ///----------------------------------------------------TO BE CONTINUED
  $('body').on('change', '.statusSelector', function(){
    //status, id
    // console.log();
    // var objectToSend = {
    //   status: $(this).val(),
    //   id: tables[i].id
    // }
    // $.ajax({
    //   url: '/changeTableStatus',
    //   type: 'POST',
    //   data: objectToSend,
    //   success: function(data){
    //     //do stuff
    //     listTables();
    //   }
    // })
  })
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
  var addLineText ='';
  console.log( 'in listEmployees');

  // loop through the tables array and display each table
  for( i=0; i< data.length; i++ ){
    var line = data[i].first_name + " " + data[i].last_name + ', id: ' + data[ i ].id;

    //add line text
    addLineText += '<li>' + line + '</li>';
  }
  //update display employees
  $('#employeesOutput').html("<ul>"+addLineText + "</ul>");

}; // end listEmployees

var listTables = function(table){
  var outputText;
  console.log( "in listTables" );

  // loop through the tables array and display each table

  // select to assign a server to this table
  console.log("employees array in display tables:", employees);
  var selectText = '<select>';
  for (var i = 0; i < employees.length; i++) {
    selectText+= '<option value=' + i + '>'+ employees[i].first_name + ' ' + employees[i].last_name + '</option>';
  }
  selectText += '</select>';
  // display employees
  console.log("data before for loop", table);
  for( i=0; i< table.length; i++ ){
    // status is a button that, when clicked runs cycleStatus for this table
    var line = table[i].table_name + " - capacity: " + table[i].capacity + ', server: ' + selectText + ', status: <ins class="tableStatus" style="display: inline;">' + table[i].status + "</ins>";
    // add line to output div
    outputText += '<p id="table' + i + '">' + line + '</p>';
    $('#tablesOutput').html(outputText);
  }
}; // end listTables
