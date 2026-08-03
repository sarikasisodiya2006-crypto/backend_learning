const dns = require("dns");
dns.setServers(["8.8.8.8","8.8.4.4"]);

const mongoose = require("mongoose");

const url ="mongodb+srv://sarikasisodiya2006_db_user:u8YkhR1qB5wZMqgt@cluster0.mql16jw.mongodb.net/techno_njr?appName=Cluster0";

const connectDB =async()=>{
    await mongoose.connect(url);
    console.log("DB connected!");
};

module.exports = connectDB;