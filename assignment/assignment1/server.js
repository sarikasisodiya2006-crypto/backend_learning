require("dotenv").config({
    path : __dirname + "/.env"
});
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require('./db.js');
const authRoutes = require("./routes/authraouter.js");
const productRoutes = require("./routes/productroutes.js");
const addressRoutes = require('./routes/addressrouter.js');

const app = express();
app.use(express.json());
app.use(cookieParser());






app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/address",addressRoutes);



connectDB()
.then(()=>{
    app.listen(Number(process.env.PORT),()=>{
    console.log("server is listening on  5000");
});
})
.catch((err)=>{
    console.log("database connection err :",err);
});


