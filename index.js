require("dotenv").config();
const express = require("express");
const app =express();

require("dotenv").config();
require("./db/connection").connect();


//middleware
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("send")
})
app.use("/api/user",require("./routes/UserRoute"))


app.listen(3000||process.env.PORT,()=>console.log("Server running"))