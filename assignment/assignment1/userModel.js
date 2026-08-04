const { required } = require("joi");
const mongoose = require("mongoose");

const  registerSchema = new mongoose.Schema({

    firstname:{
        type:String,
        minlength:2,
        maxlength:128,
        trim:true,
        required:true,
        match:/^[a-zA-Z ]+$/,
    },

     lastname:{
        type:String,
        minlength:2,
        maxlength:128,
        trim:true,
        required:true,
        match:/^[a-zA-Z ]+$/,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        match:/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    },
    dob:{
        type:Date,
        required:true,},

    gender:{
        type:String,
        required:true,
        enum:["male","female","other"],
    },

    Password:{
        type:String,
        required:true,
        minlength:2,
        maxlength:128,
        trim:true,
    }
    // confirmPassword:{
    //     type:String,
    //     required:true,
    //     minlength:2,
    //     maxlength:128,
    //     trim:true,}

});

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim : true,

    },
     price:{
        type:Number,
        min : 0,
        required:true,},

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

const productModel = mongoose.model("products",productSchema);
const registerModel = mongoose.model("register",registerSchema);
module.exports = {registerModel,productModel};