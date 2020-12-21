const route = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const response = require("../db/response");
const User = require("../models/User");


////////////////////////// LOGIN USER /////////////////////
route.post("/login", async (req, res) => {
    const user = await User.findOne({ mob: req.body.mob, role: req.body.role });
    if (!user) return response({ res, code: 400, msg: "Invalid mobile number or password" });

    //password validation
    const validPwd = await bcrypt.compare(req.body.pwd, user.pwd);
    if (!validPwd) return response({ res, code: 400, msg: "Invalid mobile number or password" });

    //token
    var token = jwt.sign({ id: user._id }, process.env.TOKEN);
    return response({
        res, data: {
            userId: user._id,
            name: user.name,
            token,
        }
    })

});


////////////////////////// REGISTRATION /////////////////////

route.post("/register", async (req, res) => {

    //validation
    const mob = parseInt(req.body.mob).toString();
    if (mob.length != 10) return response({ res, code: 422, msg: "Invalid mobile number" });

    // //Already exist
    const isUserExist = await User.findOne({ mob: req.body.mob });
    if (isUserExist) return response({ res, code: 400, msg: "Mobile number already exist" });

    // //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.pwd, salt);
    req.body.pwd = hashedPwd;

    // //save user
    const user = await new User(req.body).save();

    // //token
    var token = jwt.sign({ id: user._id }, process.env.TOKEN);
    return response({ res, data: { userId: user._id, token } });

});

////////////////////////// PASSWORD UPDATE /////////////////////
route.post("/reset", async (req, res) => {
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.pwd, salt);

    const user = await User.findOneAndUpdate({ mob: req.body.mob }, { pwd: hashedPwd });
    if (!user) return response({ res, code: 400, msg: "Mobile number not registered" });
    return response({ res, msg: "Password updated" });

});


module.exports = route;