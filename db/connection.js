const mongoose = require("mongoose");
module.exports.connect = ()=>{
    mongoose.connect(
        process.env.DB_URI,
        { useUnifiedTopology: true ,useNewUrlParser: true,useCreateIndex:true ,useFindAndModify:false},
        (err)=>{
        if(err) return console.log(err)
        console.log("Db connected");
    })
};
