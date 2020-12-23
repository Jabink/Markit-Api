require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const app =express();

require("dotenv").config();
require("./db/connection").connect();


//middleware
app.use(express.json());
app.use(fileUpload())
app.use("/api/shop/ads",require("./routes/AdsRoute"))
app.use("/api/auth",require("./routes/AuthRoute"));
app.use("/api/upload",require("./routes/UploadRoute"));
app.use("/upload",express.static("./uploads"));


app.listen(3000||process.env.PORT,()=>console.log("Server running"))