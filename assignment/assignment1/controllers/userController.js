const{registerModel} = require('../model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");


const register = async(req,res)=>{
    try{
           


        const{firstname,lastname,email,dob,gender,createPassword, confirmPassword} = req.body;

        if(createPassword !== confirmPassword){
            return res.status(400).send("Passwords do not match");
        }

        const userExists = await registerModel.findOne({email});
        if (userExists){
             return res.status(409).send("user already exists");
        }
        else{

            const hashedPassword = await bcrypt.hash(createPassword,Number(process.env.SALT));
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

   }



        //=======user login========
        const login = async(req,res)=>{
            try {
                   
                
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
                    let secretKey =  process.env.JWT_SECRETKEY;
                    const token=jwt.sign({userID:userExist._id},process.env.JWT_SECRETKEY,{expiresIn:"1h"});
                
                    res.cookie("givenToken",token,{httpOnly:true});
                
                    res.status(200).send(`Welcome ${userExist.firstname}!! You are logged in successfully!`);
                
            } catch (error) {
                console.log("err :",error)
                return res.status(400).send("internal srerver error");
                
            }
        }



                //=======logout user========  
        const logout = async(req,res)=>{
          try{
          res.clearCookie("givenToken");
          res.send("User logged out successfully!");
          } catch(err){
            console.log(err);
            res.status(500).send("SERVER ERROR!");
          }
        }

        module.exports = {login , logout , register};