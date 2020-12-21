const TABLE = require("../db/dbConstants")
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mSchema = new Schema({
    name: String,
    mob: String,
    shop: String,
    pwd: String,
    role: String,
    date: {
        type: Date,
        default: Date.now(),
    },
},{ versionKey: false });


module.exports = mongoose.model(TABLE.USERS, mSchema);