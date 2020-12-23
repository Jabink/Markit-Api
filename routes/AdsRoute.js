const response = require("../db/response");
const BannerAd = require("../models/BannerAd");
const fs = require("fs");
const route = require("express").Router();
const authToken = require("../util/AuthToken");

/////NEW AD////
route.post("/",authToken, async (req, res) => {
    try {
        const result = await BannerAd.findById(req.body.shopId)
        return response({ res, data: result.ads })
    } catch (err) {
        return response({ res, code: 400, msg: err })
    }
});

//DELETE AD/////
route.delete("/",authToken, async (req, res) => {
    try {
        await BannerAd.updateOne(
            { _id: req.body.shopId },
            { $pull: { ads: { _id: req.body.itemId } } },
            { new: true });

        ///remove uploaded file
        fs.unlinkSync(`./uploads/${req.body.itemId}.jpg`);
        
        return response({ res, msg: "Successfully removed" })
    } catch (error) {
        if (error.syscall === "unlink")
            return response({ res, msg: "Successfully removed" })
        return response({ res, code: 400, msg: error })
    }
})

module.exports = route;
