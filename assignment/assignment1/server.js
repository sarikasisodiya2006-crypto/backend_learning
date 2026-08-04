const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require('./db.js');
const authMiddelware = require('./authValidation.js')
const joi = require("joi");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {registerModel , productModel} = require('./userModel.js');



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



        //=======user login========
        app.post("/login",async(req,res)=>{
            try {
                    const validationSchema = joi.object({
                      email: joi.string().email().required(),
                      Password: joi.string().min(2).max(120).required(),
                    });
                    const { error } = validationSchema.validate(req.body);
                    if (error) {
                      return res.status(400).send(error.details[0].message);
                    }
                
                    const { email, Password } = req.body;
                    const userExist = await registerModel.findOne({ email });
                    if (!userExist) {
                      return res
                        .status(400)
                        .send("oops! Invalid credentials!!");
                    }
                    const isPasswordValid = await bcrypt.compare(Password, userExist.Password);
                    if (!isPasswordValid) {
                      return res
                        .status(400)
                        .send("OOPS! Invalid credentials!!");
                    }
                    //generate a token and send it to the user
                    let secretKey = "MySecretKey";
                    const token=jwt.sign({userID:userExist._id},secretKey,{expiresIn:"1h"});
                
                    res.cookie("givenToken",token,{httpOnly:true});
                
                    res.status(200).send(`Welcome ${userExist.name}!! You are logged in successfully!`);
                
            } catch (error) {
                console.log("err :",error)
                return res.status(400).send("internal srerver error");
                
            }
        });



                //=======logout user========  
        app.get("/logout",authMiddelware,(req,res)=>{
          try{
          res.clearCookie("givenToken");
          res.send("User logged out successfully!");
          } catch(err){
            console.log(err);
            res.status(500).send("SERVER ERROR!");
          }
        });


        //=====create product=========
        app.post("/createProduct",authMiddelware,async(req,res)=>{

            try {
                 const schema = joi.object({
                 name: joi.string().required(),
                 price: joi.number().min(0).required(),
                 category: joi.string().valid("Electronics", "Clothing", "Books", "Home", "Sports").required(),
                 SKU: joi.string().required(),

            });
            const{error} = schema.validate(req.body);
            if(error){
                return req.status(400).send(error.detail[0].message);
            }

             const productExist = await productModel.findOne({ SKU: req.body.SKU });
                if (productExist) {
                  return res.status(409).send("Product with this SKU already exists");
                }


            const{name,price,category,SKU}= req.body;
            let product = {
                name:name,
                price:price,
                category:category,
                SKU:SKU
            };
            console.log(product)
                await productModel.create(product);
                return res.status(209).send("product created successfully!");
            } catch (error) {
                console.log("err : ",error)
                return res.status(400).send("internal server error");
                
            }
           
        });


        //====get product ======
        app.get("/getProduct",authMiddelware, async(req,res)=>{
            try {
                const{page=1,limit=2,sort="asc"}=req.query;

                let product = await productModel.findOne({})
                .skip((page-1)*limit)
                .limit(limit)
                .sort({price: sort==="asc"?1:-1})
                .select("-_id -__v -SKU");

               res.json(product);
            } catch (error) {
             console.log("err : ",error)
                return res.status(400).send("internal server error");
                   
            }
        })


        //=====delete product=======
        app.delete("/deleteStudentbySKU/:sku",authMiddelware,async(req,res)=>{
            try {
                const {sku}=req.params;
                const product = await productModel.findOne({SKU:sku});
                if(!product){
                    return res.status(404).send("product not found");
                }
                await productModel.deleteOne({SKU:sku});
                return res.status(200).send("product deleted !");
                
            } catch (error) {
             console.log("err : ",error)
                return res.status(400).send("internal server error");
                      
            }

        })

        //===update product=======
        app.put("/updateProduct/:sku",authMiddelware,async(req,res)=>{

            const product = await productModel.findOne({ sku: req.params.sku });

console.log(product);
            try {
                 const updateProduct= await productModel.findOneAndUpdate({SKU:req.params.sku},{$set:req.body},{ returnDocument: "after" });

            if(!updateProduct){
                return res.status(404).send("product not found");
            }

            return res.json(updateProduct);
            } catch (error) {
                console.log("err : ",error)
                return res.status(400).send("internal server error");
            }

           
        });





connectDB()
.then(()=>{
    app.listen(5000,()=>{
    console.log("server is listening on  5000");
});
})
.catch((err)=>{
    console.log("database connection err :",err);
});


