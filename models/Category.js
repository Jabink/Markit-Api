const TABLE = require("../db/dbConstants")
const mongoose =require("mongoose");

const catSchema = new mongoose.Schema({
    name:String,
    image:String,
    subCategoryId:String
},{versionKey:false});

const schema = new mongoose.Schema({
    categories:[catSchema]
}, { versionKey: false });


module.exports = mongoose.model(TABLE.CATEGORIES,schema);