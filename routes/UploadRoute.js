const { isValidObjectId } = require("mongoose");
const response = require("../db/response");
const BannerAd = require("../models/BannerAd");
const User = require("../models/User");
const route = require("express").Router();

////////UPLOAD BANNER ///////
route.post("/banner", async (req, res) => {
    try {
        const date = Date.now();

        //check user exist
        const user = await User.findById(req.body.shopId);
        if (!user || user.role != "shop") return response({ res, code: 400, msg: "invalid data" });

        

        //save banner ad
        const data = await BannerAd.findOneAndUpdate(
            { _id: req.body.shopId },
            { $push: { ads: req.body } },
            { upsert: true, new: true }
        );
        //save image with _id of inserted item
        const filename = data.ads[data.ads.length - 1]._id;
        if (!imageUploadError(req, res, filename))
            return response({ res, data: {_id:filename} });
    } catch (err) {
        return response({ res, code: 400, msg: err })
    }
});


///image empty,invalid file format,error on moving file
const imageUploadError = (req, res, filename) => {
    if (!req.files || Object.keys(req.files).length === 0)
        return response({ res, code: 400, msg: "File is empty" });

    const file = req.files.image;
    if (!(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"))
        return response({ res, code: 403, msg: "Invalid file format" })


    const path = `./uploads/${filename}.jpg`;
    file.mv(path, err => {
        if (err) return response({ res, code: 500, msg: err })
    });
}



module.exports = route;