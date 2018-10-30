var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var table = require("cli-table");
var wordwrap = require("wordwrap");
var products = [];
var prompt = inquirer.createPromptModule();

var questions = [
  {
    type: 'input',
    name: 'item_index',
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
    name: 'order_quantity',
    message: "Select the quantity of the item you would like to buy",
    validate: function(value) {
      var pass = value.match(
        /^\d+$/
      );
      if (pass && pass > 0 && pass) {
        return true;
      }

      return 'Please enter a number';
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
      console.log("promptForItemNo ");
      console.log(answers);
      var i = parseInt(answers.item_index) - 1;
      console.log(i);
      var qty = parseInt(answers.order_quantity);
      console.log("quantity " + qty);
      console.log(products[i]);
      updateQuantity(products[i].item_id, qty)
    });
}

function updateQuantity(item_id, qty) {
  console.log("updateQuantity.qty " + qty);
  console.log("updateQuantity.item_id " + item_id);
  //UPDATE amazon_store.products SET stock_quantity = "5" WHERE (item_id = "HAN 3PCCW");
  //UPDATE `amazon_store`.`products` SET stock_quantity= stock_quantity - '1' WHERE (`item_id` = 'HAN 3PCCW');

  var sql = 'UPDATE amazon_store.products SET stock_quantity = stock_quantity - ' + '"' + qty + '"' + ' WHERE (item_id = ' + '"'  + item_id + '")';

  console.log("sql= " + sql);
  connection.query(sql, function (err, results) {
    if (err) throw err;
    process.exit();
  });
}


console.log("\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+"\n"+ "\n" + "----------------------"+"WELCOME TO THE AMAZON STORE".bgCyan + "----------------------" + "\n" );
function logProducts(results) {
  if (!results || !results.length) {
    console.log("No products...");
    return;
  }
  for (var i = 0; i < results.length; i++) {
    console.log("\n");
    console.log(i + 1 + ". Item ID: ".red + results[i].item_id + "  Price: ".red + results[i].price +
      "  Product Name: ".red + results[i].product_name + " Quantity: ".red + results[i].stock_quantity);
    console.log('\x1b[36m%s\x1b[0m', "________________________________________________" + "\n");
  }
}

function logOneProducts(itemNo) {
  connection.query("SELECT * FROM products WHERE item_id = '" + itemNo + "'", function (err, results) {
    if (err) throw err;
  
    console.log("Item ID: ".red + itemNo[0].item_id);
    console.log("Department: ".red + itemNo[0].department_name);
    console.log("Price: ".red + results[0].price);
    console.log("Product Name: ".red + results[0].product_name);
    console.log("Quantity: ".red + results[0].stock_quantity);
  });
}

