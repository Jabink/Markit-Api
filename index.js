// require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

require("dotenv").config();
require("./db/connection").connect();


//middleware
app.use(express.json());
app.use(fileUpload());
app.use("/api/category",require("./routes/Category"));
app.use("/api/product",require("./routes/Product"));
app.use("/api/shop/ads", require("./routes/AdsRoute"));
app.use("/api/auth", require("./routes/AuthRoute"));
///uploads folder
app.use("/upload", express.static("./uploads"));
app.get("/",(req,res)=> res.send("Page opened"));

app.listen(process.env.PORT || 3000, () => console.log("Server running"))