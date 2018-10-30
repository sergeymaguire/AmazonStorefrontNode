var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var products = [];
var prompt = inquirer.createPromptModule();

var questions = [
  {
    type: 'input',
    name: 'item_id',
    message: "Please select the item number you wish to buy(1-10)",
    validate: function(value) {
      var pass = value.match(
        /^\d+$/
      );
      if (pass && pass > 0 && pass <= products.length) {
        return true;
      }

      return 'Please enter a number between 1-10';
    }
  },
  {
    type: 'input',
    name: 'stock_quantity',
    message: "Select the quantity of the item you would like to buy",
    validate: function(value) {
      var pass = value.match(
        /^\d+$/
      );
      if (pass && pass > 0 && pass) {
        return true;
      }

      return 'Please enter a number between 1-10';
    }
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
  runSearch(processResults);
});

function runSearch(searchCallback) {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;

    searchCallback(results);
  });
}

function processResults(results) {
    products = results;
    logProducts(products);
    promptForItemNo();
}

function promptForItemNo() {
    prompt(questions).then(function (answers) {
      console.log(answers);
      var i = parseInt(answers.item_id) - 1;
      console.log(i);
      console.log(products[i]);
    });
}

function logProducts(results) {
  if (!results || !results.length) {
    console.log("No products...");
    return;
  }
  for (var i = 0; i < results.length; i++) {
    console.log(i + 1 + ". Item ID: ".red + results[i].item_id + "  Price: ".red + results[i].price +
      "  Product Name: ".red + results[i].product_name);
    console.log('\x1b[36m%s\x1b[0m', "________________________________________________" + "\n");
  }
}

function logOneProducts(itemNo) {
  connection.query("SELECT * FROM products WHERE item_id = '" + itemNo + "'", function (err, results) {
    if (err) throw err;

    //console.log(results);
    console.log('\x1b[36m%s\x1b[0m', "WELCOME TO THE AMAZON STOREFRONT" + "\n");
    console.log("Item ID: ".red + itemNo[0].item_id);
    console.log("Department: ".red + itemNo[0].department_name);
    console.log("Price: ".red + results[0].price);
    console.log("Product Name: ".red + results[0].product_name);
    console.log("Quantity: ".red + results[0].stock_quantity);
  });
}