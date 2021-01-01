const response = require("../db/response");
const BannerAd = require("../models/BannerAd");
const route = require("express").Router();
const authToken = require("../util/AuthToken");
const checkShopAccess = require("../util/CheckShopAccess");
const image = require("../util/ImageUpload");

/////GET AD////
route.post("/", authToken, async (req, res) => {
    try {
        const result = await BannerAd.findById(req.body.userId)
        try {
            if(result.ads.length==0) {
                await BannerAd.deleteOne({_id:req.body.userId});
                result.ads=[];
            }
        } catch (error) {
            return response({ res, data:[] })
        }
        return response({ res, data: result.ads })
    } catch (err) {
        return response({ res, code: 400, msg:err.toString() })
    }
});

///ADD NEW AD///////
route.post("/add",authToken,checkShopAccess,async (req,res)=>{
    try {
        //save banner ad
        const data = await BannerAd.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { ads: req.body } },
            { upsert: true, new: true }
        );
        //save image with _id of inserted item
        const filename = data.ads[data.ads.length - 1]._id;
        image.upload(req,res,filename);
    
    } catch (err) {
        return response({ res, code: 400, msg: err.toString() })
    }
})

//DELETE AD/////
route.delete("/", authToken,checkShopAccess, async (req, res) => {
    try {
       await BannerAd.updateOne(
            { _id: req.body.userId },
            { $pull: { ads: { _id: req.body.itemId } } },
            { new: true });

       image.delete(req.body.itemId);

        return response({ res, msg: "Successfully removed"})
    } catch (error) {
        if (error.syscall === "unlink")
            return response({ res, msg: "Successfully removed" })
        return response({ res, code: 400, msg: error.toString() })
    }
})







module.exports = route;
