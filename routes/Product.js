const route = require("express").Router();
const response = require("../db/response");
const Product = require("../models/Product");
const authToken = require("../util/AuthToken");
const checkShopAccess = require("../util/CheckShopAccess");
const {image,isFileExist,isFileTypeValid} = require("../util/ImageUpload");

// /////GET PRODUCTS////
route.post("/", authToken, async (req, res) => {
    try {
        const result = await Product.findById(req.body.userId)
        try {
            if (result.products.length == 0) {
                await Product.deleteOne({ _id: req.body.userId });
                result.products = [];
            }
        } catch (error) {
            return response({ res, data: [] })
        }
        return response({ res, data: result.products })
    } catch (err) {
        return response({ res, code: 400, msg: err.toString() })
    }
});

/////////////ADD PRODUCTS/////////////
route.post('/add', authToken, checkShopAccess,isFileExist,isFileTypeValid, async(req, res) => {
    try {
        // save
        const data = await Product.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { products: req.body } },
            { upsert: true, new: true }
        );
        //save image with _id of inserted item
        const filename = data.products[data.products.length - 1]._id;
        image.upload(req, res, filename);
    } catch (error) {
        return response({ res, code: 400, msg: error.toString() })
    }
});

// //DELETE PRODUCTS/////
route.delete("/", authToken, checkShopAccess, async (req, res) => {
    try {

        await Product.updateOne(
            { _id: req.body.userId },
            { $pull: { products: { _id: req.body.itemId } } },
            { new: true });

        image.delete(req.body.itemId);

        return response({ res, msg: "Successfully removed" })
    } catch (error) {
        if (error.syscall === "unlink")
            return response({ res, msg: "Successfully removed" })
        return response({ res, code: 400, msg: error.toString() })
    }
});

// ///UPDATE PRODUCT////
route.put("/", authToken,isFileTypeValid, async (req, res) => {
    try {
        await Product.updateOne(
            { "products._id": req.body.itemId },
            {
                $set: {
                    "products.$.name": req.body.name,
                    "products.$.categoryId": req.body.categoryId,
                    "products.$.discription": req.body.discription,
                    "products.$.price": req.body.price,
                    "products.$.mrp": req.body.mrp,
                }
            }
        );
        //update image with _id of inserted item
        const filename = req.body.itemId;
        image.upload(req, res, filename);

    } catch (error) {
        if (error.syscall === "unlink")
            return response({ res, msg: "Successfully updated" })
        return response({ res, code: 400, msg: error.toString() })
    }
});



module.exports = route;