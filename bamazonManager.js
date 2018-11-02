var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var table = require("cli-table");
var wordwrap = require("wordwrap");
var products = [];
var prompt = inquirer.createPromptModule();
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "1525wilma",
    database: "amazon_store"
});

function connectAndSearch(lessThanFive, promptAddToStockQty) {
    connection.connect(function (err) {
        if (err) throw err;
        var sql = "SELECT * FROM products";
        if (lessThanFive)
            sql = sql + " WHERE stock_quantity < 5";
        //console.log(sql);
        connection.query(sql, function (err, results) {
            if (err) throw err;

            products = results;

            logProducts(results);
            if(promptAddToStockQty)
               promptAddToStockQty();
        });
    });

}


function addToInventory(item_id, qty) {
    // console.log("updateQuantity.qty " + qty);
    // console.log("updateQuantity.item_id " + item_id);
    //UPDATE amazon_store.products SET stock_quantity = "5" WHERE (item_id = "HAN 3PCCW");
    //UPDATE `amazon_store`.`products` SET stock_quantity= stock_quantity - '1' WHERE (`item_id` = 'HAN 3PCCW');

    var sqlUpdateQty =
        "UPDATE amazon_store.products SET stock_quantity = stock_quantity + " +
        '"' +
        qty +
        '"' +
        " WHERE (item_id = " +
        '"' +
        item_id +
        '")';

    //console.log("sqlUpdateQty= " + sqlUpdateQty);
    connection.query(sqlUpdateQty, function (err, results) {
        if (err) throw err;
        process.exit();
    });
}

function addNewProduct() {
    console.log("add new product!")
}

function logProducts(results) {
    if (!results || !results.length) {
        console.log("No products...");
        return;
    }
    for (var i = 0; i < results.length; i++) {
        //console.log("\n");
        console.log(
            i +
            1 +
            ". Item ID: ".red +
            results[i].item_id +
            "  Price: ".red +
            results[i].price +
            "  Product Name: ".red +
            results[i].product_name +
            " Quantity: ".red +
            results[i].stock_quantity
        );
        console.log(
            "\x1b[36m%s\x1b[0m",
            "________________________________________________" + "\n"
        );
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
                    connectAndSearch(true);
                    break;

                case "Add to Inventory":
                    if (!products)
                        console.log("Please view products for sale first!");
                        connectAndSearch(false, promptAddToStockQty);
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

function exitManagerView() {
    process.exit(1);
};

console.log("\n" + " Press CTRL C to quit anytime...".america + "\n");
chooseMenu();



function promptAddToStockQty() {
    console.log("promptAddToStockQty");
    var questions = [{
            type: "input",
            name: "item_index",
            message: "Please enter the item number",
            validate: function (value) {
                var pass = value.match(/^\d+$/);
                if (pass && pass > 0 && pass <= products.length) {
                    currentItemNo = value - 1; //store this to be used in verification of quantity...
                    return true;
                }

                return "Please enter a number between 1-10";
            }
        },
        {
            type: "input",
            name: "order_quantity",
            message: "Enter the quantity",
            validate: function (value) {

                replenishQty = parseInt(value);

                if (!replenishQty) return "Please enter a number";

                console.log("\n" + "replenishQty " + replenishQty);
                console.log("\n" + "Validate order quantity " + replenishQty);
                console.log("currentItemNo " + currentItemNo);
                console.log("stock_quantity " + products[currentItemNo].stock_quantity);
                if (replenishQty <= 0) {
                    return "please enter a quantity greater than 0";
                }


                return true;

            }
        }
    ];
    prompt(questions).then(function (answers) {
        //console.log("promptForItemNo ");
        //console.log(answers);
        var i = parseInt(answers.item_index) - 1;
        //console.log(i);
        var qty = parseInt(answers.order_quantity);
        //console.log("quantity " + qty);
        //console.log(products[i]);
        addToInventory(products[i].item_id, qty);
    });
}