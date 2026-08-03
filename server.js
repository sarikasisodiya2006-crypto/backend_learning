const express = require("express");
const bcrypt = require("bcryptjs");
const joi = require("joi");
const cookieParser = require("cookie-parser");
const connectDB = require('./db.js');
const jwt = require("jsonwebtoken");
const authMiddelware = require('./authValidation.js');
const app = express();

const {studentModel ,registerModel, productModel } = require('./userModel.js');


app.use(cookieParser());
app.use(express.json());

                //======CRUD OPERATIONS=========

//====CREATE/POST=====
app.post("/createStudent",async(req,res)=>{
    
   try {
        const{name,course,email,roll_no,Streams,skills,address,gender}=req.body;
         console.log(req.body);
        let studentData ={
        name: name,
        course : course,
        email:email,
        roll_no:roll_no,
        Streams:Streams,
        skills:skills,
        address:address,
        gender:gender,
                        };
    await  studentModel.create(studentData);
    res.send("studentData");
     } catch(err){
        console.log("err : ",err);
                 };
},
    
        );


        //=====READ/GET==========
        app.get("/getAllStudents",async(req,res)=>{
        try {
            const page = Number(req.query.page)||2;
            const limit = Number(req.query.limit) ||3;
            let allStudent =  await studentModel
            .find({})
            .skip((page-1)*limit)
            .limit(limit)
            // .limit(3).skip(2)
            .select("-_id -email");
         res.json(allStudent);
            
        } catch (error) {

            console.log("err : ",error);
        } 
        });

        //=== GET student by id ========
        app.get("/getstudentById/:id",async(req,res)=>{
            try {
                let singleStudent = await studentModel.findById(req.params.id);
                if(singleStudent== null){
                    res.status(404).send("student not found!");
                }

                res.json(singleStudent);
            } catch (error) {
                  console.log("err : ",error);
            }
        });

        //========UPDATE/PUT=====
            app.put("/student/:id",async(req,res)=>{
                try {
                    let  updateStudent = await studentModel.findByIdAndUpdate(req.params.id,{$set:req.body});
                     if(updateStudent== null){
                    res.status(404).send("student not found!");
                                             }
                    res.json(updateStudent);

                } catch (error) {
                    console.log("err : ",error);
                }
            });


        //=====DELETE=====
            app.delete("/deleteStudent/:id",async(req,res)=>{
                try {
                    await studentModel.findByIdAndDelete(req.params.id);
                    res.send("student deleted !");
                    
                } catch (error) {
                    console.log("err : ",error);
                }
            });



           //=====REGISTER USER=====
    app.post("/register", async (req, res) => {
  try {

    const schema = joi.object({
      name: joi.string().min(3).max(30).required(),
      email: joi.string().email().required().lowercase(),
      password: joi.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { name, email, password} = req.body;
    const userExists = await registerModel.findOne({ email });
    if (userExists) {
      return res.status(409).send("User already exists");
    }
    else{

        const hashedPassword = await bcrypt.hash(password, 10);


        let newUser= {
      name: name,
       email: email,
      password: hashedPassword,
     
    };
    await registerModel.create(newUser);
    res.status(201).send("user registered successfully!!!");
    }
    
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});



                    //====LOGIN USER=====
    app.post("/login", async (req, res) => {
  try {
    console.log(req.cookies);
    const validationSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(8).max(20).required(),
    });
    const { error } = validationSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { email, password } = req.body;
    const userExist = await registerModel.findOne({ email });
    if (!userExist) {
      return res
        .status(400)
        .send("oops! Invalid credentials!!");
    }
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
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
    console.log(req.cookies);
    
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});




          //=====CREATEPRODUCT=======
      app.post("/createProduct",async(req,res)=>{
        try {

      const validationSchema = joi.object({
        name: joi.string().required(),
        price: joi.number().min(0).required(),
        description: joi.string().max(512).required(),
        category: joi.string().valid("Electronics", "Clothing", "Books", "Home", "Sports").required(),
        SKU: joi.string().required(),
    });
    const { error } = validationSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }


    const productExist = await productModel.findOne({ SKU: req.body.SKU });
    if (productExist) {
      return res.status(409).send("Product with this SKU already exists");
    }


          const{name,price,description,category,SKU}=req.body;
          console.log(req.body);

          const productData ={
            name: name,
            price: price,
            description: description,
            category: category,
            SKU:SKU
          };

          await productModel.create(productData);
          res.status(201).send("Product created successfully!!");
        } catch (error) {
          console.log("err : ",error);
        }
      });




        //=======GETALLPRODUCTS========
      app.get("/getAllProducts",authMiddelware,async(req,res)=>{
        try {
          const {page=1,limit=3,sort="ASC"} = req.query;
          // const page = Number(req.query.page)||2;
          //   const limit = Number(req.query.limit) ||3;

          let allProduct = await productModel.find({})
            .skip((page-1)*limit)
            .limit(limit)
            .sort({price: sort === "asc" ? 1 : -1})
            .select("-_id -SKU -__v");
          res.json(allProduct);

        } catch (error) {
          console.log("err : ",error);
        }
      });
      

        //===GETPRODUCT BY ID =======
        app.get("/getProductById/:id",authMiddelware,async(req,res)=>{

          try {

            const product = await productModel.findById(req.params.id).select("-_id -SKU -__v");
            if(!product){
              return res.status(404).send("Product not found");
            } res.send(product);
            
          } catch (error) {
            console.log("err : ",error);
            
          }
        })







connectDB()
.then(()=>{
    app.listen(5000,()=>{
    console.log("server is listening on port 5000");
});
})
.catch((err)=>{
    console.log("database connection err :",err);
});


   