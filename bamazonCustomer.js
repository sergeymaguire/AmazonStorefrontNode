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
// console.log (logOneProducts("TCL 32S305"));

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
       //var answers = JSON.stringify(answers, null, '');
       console.log(answers);
      console.log("You selected item: " + answers.item_id);


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
    console.log('\x1b[36m%s\x1b[0m', "________________________________________________" + "\n");
    console.log("Item ID: ".red + results[i].item_id + "  Price: ".red + results[i].price +
      "  Product Name: ".red + results[i].product_name);
    console.log('\x1b[36m%s\x1b[0m', "________________________________________________" + "\n"); 
  }
}

function logOneProducts(itemNo) {
  connection.query("SELECT * FROM products WHERE item_id = '" + itemNo + "'", function (err, results) {
    if (err) throw err;

  console.log(results);
  console.log('\x1b[36m%s\x1b[0m',"WELCOME TO THE AMAZON STOREFRONT" + "\n");
  console.log("Item ID: ".red + itemNo[0].item_id);
  console.log("Department: ".red + itemNo[0].department_name);
  console.log("Price: ".red + results[0].price);
  console.log("Product Name: ".red + results[0].product_name);
  console.log("Quantity: ".red + results[0].stock_quantity);
});
}

