const TABLE = require("../db/dbConstants")
const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
    image:String,
    type:String,
    path:String
},{ versionKey: false });

const schema = new mongoose.Schema({
    ads:[adSchema]
}, { versionKey: false });


module.exports = mongoose.model(TABLE.ADS, schema);