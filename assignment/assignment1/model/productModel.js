const mongoose = require('mongoose');
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

productSchema.index({category:1});
productSchema.index({price :1});

const productModel = mongoose.model("products",productSchema);
module.exports = productModel;