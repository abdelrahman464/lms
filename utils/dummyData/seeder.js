const fs = require("fs");
require("colors");
const dotenv = require("dotenv");
// const Product = require("../../models/storeModels/storeProductModel");
 const Package = require("../../models/educationModel/educationPackageModel");
const dbconnection = require("../../config/database");

dotenv.config({ path: "../../config.env" });

dbconnection();

const data = JSON.parse(fs.readFileSync("./packageCourse.json"));

//insert data into db
const insertData = async () => {
  try {
    await Package.create(data);
    console.log("Data inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
}
//delete data from db
const deleteData = async () => {
  try {
    await Package.deleteMany();
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
