const fs = require("fs");
require("colors");
const dotenv = require("dotenv");
const Product = require("../../models/productModel");
const dbconnection = require("../../config/database");

dotenv.config({ path: "../../config.env" });

dbconnection();

const products = JSON.parse(fs.readFileSync("./products.json"));

//insert data into db
const insertData = async () => {
  try {
    await Product.create(products);
    console.log("Data inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
}
//delete data from db
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data deleted".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
}


if(process.argv[2]==='-i'){//node seeder.js -i
    insertData();
}else if(process.argv[2]==='-d'){ //node seeder.js -d   
    deleteData();
}
