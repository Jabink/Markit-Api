const jwt = require("jsonwebtoken");
const response = require("../db/response");


module.exports = async (req,res,next)=>{
    try{
    const token = req.headers.authorization.split(" ")[1];
    await jwt.verify(token,process.env.TOKEN)
    next()
    }catch(err){
        return response({res,code:403,msg:err});
    }
}