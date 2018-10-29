var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
 
    port: 3306,
  
  
    user: "root",
  
    
    password: "1525wilma",
    database: "amazon_store"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    runSearch();
  });

function runSearch() {
    console.log("run Search");
}