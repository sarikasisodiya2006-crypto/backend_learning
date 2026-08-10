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
    role:{
        type:String,
        enum:["user","admin","seller"],
        required:true,
        trim:true,
        default:"user",
        maxlength:10,
    },

    Password:{
        type:String,
        required:true,
        minlength:2,
        maxlength:128,
        trim:true,
    }
});


registerSchema.virtual("addresses", {
    ref: "address",
    localField: "_id",
    foreignField: "user",
});

registerSchema.set("toJSON", {
    virtuals: true
});

registerSchema.set("toObject", {
    virtuals: true
});


const registerModel = mongoose.model("register",registerSchema);
module.exports = registerModel;