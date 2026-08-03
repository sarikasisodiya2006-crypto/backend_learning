const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require('./db.js');
const joi = require("joi");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {registerModel} = require('./userModel.js');



app.use(express.json());
app.use(cookieParser());




   //=======user registration========
   app.post("/register",async(req,res)=>{
    try{
            const schema = joi.object({
                firstname : joi.string().min(2).max(128).required().pattern(/^[a-zA-Z ]+$/).trim(),
                lastname : joi.string().min(2).max(128).required().pattern(/^[a-zA-Z ]+$/).trim(),
                email : joi.string().email().required().trim().lowercase(),
                dob : joi.date().required(),
                gender : joi.string().valid("male","female","other").required(),
                createPassword : joi.string().min(2).max(128).required().trim(),
                confirmPassword : joi.string().min(2).max(128).required().trim(),
            });

            const {error} = schema.validate(req.body);
            if(error){
                return res.status(400).send(error.details[0].message);
            } ;



        const{firstname,lastname,email,dob,gender,createPassword, confirmPassword} = req.body;

        if(createPassword !== confirmPassword){
            return res.status(400).send("Passwords do not match");
        }

        const userExists = await registerModel.findOne({email});
        if (userExists){
             return res.status(409).send("user already exists");
        }
        else{

            const hashedPassword = await bcrypt.hash(createPassword,10);
        let userData = {
            firstname:firstname,
            lastname:lastname,
            email:email,
            dob:dob,
            gender:gender,
            Password:hashedPassword,
            
        };

        await registerModel.create(userData);
       return res.status(201).send("user registered successfully");
    
                }
    } catch(err){
        console.log("err : ",err);
    }

   });




   

connectDB()
.then(()=>{
    app.listen(5000,()=>{
    console.log("server is listening on port 5000");
});
})
.catch((err)=>{
    console.log("database connection err :",err);
});


