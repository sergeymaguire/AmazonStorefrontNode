var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var table = require("cli-table");
var wordwrap = require("wordwrap");
var prompt = inquirer.createPromptModule();
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "1525wilma",
    database: "amazon_store"
});

function connectAndSearch() {
    connection.connect(function (err) {
        if (err) throw err;

        connection.query("SELECT * FROM products", function (err, results) {
            if (err) throw err;
    
            logProducts(results);
        });
    });
    
}

function viewLowInventory() {
    console.log("Items that are low");
};

function addToInventory() {
    console.log("add new inventory here!")
}

function addNewProduct() {
    console.log("add new product!")
}

function logProducts(results) {
    if (!results.length) {
        console.log("No products...");
        return;
    }
    for (var i = 0; i < results.length; i++) {
        console.log("Item ID: ".red + results[i].item_id + "  Price: ".red + results[i].price +
            "  Product Name: ".red + results[i].product_name);
        console.log('\x1b[36m%s\x1b[0m', "________________________________________________" + "\n");
    }
}

function chooseMenu() {
    console.log("chooseMenu");
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "Please select a menu option?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit Manager View"
            ]
        })
        .then(function (answers) {
            switch (answers.menu) {
                case "View Products for Sale":
                    connectAndSearch();
                    break;

                case "View Low Inventory":
                viewLowInventory();
                    break;

                case "Add to Inventory":
                addToInventory();
                    break;

                case "Add New Product":
                addNewProduct();
                    break;

                case "Exit Manager View":
                exitManagerView();
                    break;

            };
          
        });
};

function exitManagerView () {
    process.exit(1);
};

console.log("\n" + " Press CTRL C to quit anytime...".america + "\n");
chooseMenu();