const TABLE = require("../db/dbConstants")
const mongoose = require("mongoose");

const prodSchema = new mongoose.Schema({
    name: String,
    image:String,
    categoryId:String,
    discription:String,
    price:String,
    discount:String,
    mrp:String,
}, { versionKey: false });

const schema = new mongoose.Schema({
    products:[prodSchema]
}, { versionKey: false });


module.exports = mongoose.model(TABLE.PRODUCTS, schema);