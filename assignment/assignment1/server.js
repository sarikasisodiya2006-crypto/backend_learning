const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require('./db.js');
const authRoutes = require("./routes/authraouter.js");
const productRoutes = require("./routes/productroutes.js");
const app = express();
app.use(express.json());
app.use(cookieParser());






app.use("/auth", authRoutes);
app.use("/product", productRoutes);



connectDB()
.then(()=>{
    app.listen(5000,()=>{
    console.log("server is listening on  5000");
});
})
.catch((err)=>{
    console.log("database connection err :",err);
});


