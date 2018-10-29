var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var prompt = inquirer.createPromptModule();

var questions = [{
  type: 'input',
  name: 'item_id',
  message: "Please enter an item number"
}];

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "1525wilma",
  database: "amazon_store"
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;

    logProducts(results);

    prompt(questions).then(function (answers) {
      var answer = JSON.stringify(answers, null, '  ');
      console.log(answer);
      console.log("You selected item: " + answer.item_id);


    });
  });

}


function logProducts(results) {
  if (!results.length) {
    console.log("No products...");
    return;
  }
  for (var i = 0; i < results.length; i++) {
    //console.log(results);
    console.log('\x1b[36m%s\x1b[0m', "WELCOME TO THE AMAZON STOREFRONT" + "\n");
    console.log("Item ID: ".red + results[i].item_id + "  Price: ".red + results[i].price +
      "  Product Name: ".red + results[i].product_name);
  }
}

function logOneProducts(itemNo) {
  connection.query("SELECT * FROM products WHERE item_id = '" + itemNo + "'", function (err, results) {
    if (err) throw err;

    logProducts(results);
  });
  //console.log(results);
  //console.log('\x1b[36m%s\x1b[0m',"WELCOME TO THE AMAZON STOREFRONT" + "\n");
  // console.log("Item ID: ".red + itemNo[i].item_id);
  // console.log("Department: ".red + itemNo[i].department_name);
  // console.log("Price: ".red + results[i].price);
  // console.log("Product Name: ".red + results[i].product_name);
  // console.log("Quantity: ".red + results[i].stock_quantity);
}

function test() {

}