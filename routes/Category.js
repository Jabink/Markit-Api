const route = require("express").Router();
const response = require("../db/response");
const Category = require("../models/Category");
const authToken = require("../util/AuthToken");
const checkShopAccess = require("../util/CheckShopAccess");
const {image,isFileExist,isFileTypeValid} = require("../util/ImageUpload");

// /////GET CATEGORIES////
route.post("/", authToken, async (req, res) => {
    try {
        const result = await Category.findById(req.body.userId)
        try {
            if (result.categories.length == 0) {
                await Category.deleteOne({ _id: req.body.userId });
                result.categories = [];
            }
        } catch (error) {
            return response({ res, data: [] })
        }
        return response({ res, data: result.categories })
    } catch (err) {
        return response({ res, code: 400, msg: err.toString() })
    }
});

/////////////ADD CATEGORY/////////////
route.post('/add', authToken, checkShopAccess,isFileExist,isFileTypeValid, async(req, res) => {
    try {
        // save
        const data = await Category.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { categories: req.body } },
            { upsert: true, new: true }
        );
        //save image with _id of inserted item
        const filename = data.categories[data.categories.length - 1]._id;
        image.upload(req, res, filename);
    } catch (error) {
        return response({ res, code: 400, msg: error.toString() })
    }
});

// //DELETE CATEGORY/////
route.delete("/", authToken, checkShopAccess, async (req, res) => {
    try {

        await Category.updateOne(
            { _id: req.body.userId },
            { $pull: { categories: { _id: req.body.itemId } } },
            { new: true });

        image.delete(req.body.itemId);

        return response({ res, msg: "Successfully removed" })
    } catch (error) {
        if (error.syscall === "unlink")
            return response({ res, msg: "Successfully removed" })
        return response({ res, code: 400, msg: error.toString() })
    }
});

// ///UPDATE CATEGORY////
route.put("/", authToken,isFileTypeValid, async (req, res) => {
    try {
        await Category.updateOne(
            { "categories._id": req.body.itemId },
            {
                $set: {
                    "categories.$.name": req.body.name,
                    "categories.$.subCategoryId": req.body.subCategoryId,
                }
            }
        );
        //update image with _id of inserted item
        const filename = req.body.itemId;
        image.upload(req, res, filename);

    } catch (error) {
        // if (error.syscall === "unlink")
        //     return response({ res, msg: "Successfully updated" })
        return response({ res, code: 400, msg: error.toString() })
    }
});



module.exports = route;