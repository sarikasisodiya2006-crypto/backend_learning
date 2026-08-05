const dns = require("dns");
dns.setServers(["8.8.8.8","8.8.4.4"]);
require("dotenv").config();


const mongoose = require("mongoose");
const url = process.env.MONGODB_URL;

const connectDB = async()=>{
    await mongoose.connect(url);
    console.log("DB connected!");
}

module.exports = connectDB;