const { required } = require("joi");
const mongoose=require("mongoose");

const registerSchema = new mongoose.Schema(
     {
    name: {
      type: String,
      minlength: 2,
      maxlength: 128,
      required: true,
      trim: true,
      match: /^[a-zA-Z ]+$/,
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 128,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    },
  },
  { timestamps: true }

    );


const addresSchema = new mongoose.Schema({
    house_no:{
        type:String,
        
        trim:true,
    },
    colony:{
        type:String,
        trim:true,
    },
    area:{
        type:String,
        trim:true,
    },
    city:{
        type:String,
        trim:true,
    },
    district:{
        type:String,
        trim:true,
    },
    state:
    {
        type:String,
        trim:true,
    }
},
{timestamps:true});

const studentSchema = new mongoose.Schema({
name:{
    type:String,
    minlength :2,
    maxlength : 128,
    required:true,
    trim : true,
    match: /^[a-zA-Z ]+$/,
},
course:String,
email : {type:String, unique:true,required:true},
roll_no : Number,
Streams : {
    type:String,
    uppercase:true,
    enum: ["CSE","ECE","AI","CIVIL","MECHANICAL"],
    trim:true,
    },

skills:[String],
 address:{type:addresSchema,default:{}},
 gender:{
    type:String,
    default:"",
    validate:{
        validator:(v)=>{
            if(!["male","female","others"].includes(v)){
                 throw new Error("Invalid gender");
            }
            return true;
        }
    }
 }

},
    {timestamps:true,strict:true}
    );

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,},

    price:{
        type:Number,
        min : 0,
        required:true,},

        description :{
            type:String,
            trim : true,
            maxlength:512,
        },

        category:{
            type:String,
            required:true,
            trim:true,
            enum:["Electronics","Clothing","Books","Home","Sports"],
        },
        SKU :{
            type:String,
            trim:true,
            required:true,
            unique:true,

        },
});


const studentModel = mongoose.model("student",studentSchema);
const registerModel = mongoose.model("register", registerSchema);
const productModel = mongoose.model("product", productSchema);
module.exports = { studentModel, registerModel , productModel};
