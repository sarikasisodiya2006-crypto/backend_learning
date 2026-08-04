const mongoose = require('mongoose');


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
});

const registerModel = mongoose.model("register",registerSchema);
module.exports = registerModel;