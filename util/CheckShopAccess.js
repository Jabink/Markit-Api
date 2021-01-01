const response = require("../db/response");
const User = require("../models/User");

module.exports = async (req,res,next)=>{
    try {
        const user = await User.findById(req.body.userId);
        if (!user || user.role != "shop") return response({ res, code: 400, msg: "Invalid user" });
        next()
    } catch (err) {
        return response({res,code:400,msg:err.toString()});
    }

}