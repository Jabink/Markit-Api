const TABLE = require("../db/dbConstants")
const mongoose =require("mongoose");
const schema = new mongoose.Schema({

},{versionKey:false});
module.exports = mongoose.model(TABLE.ADS,schema);