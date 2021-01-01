const response = require("../db/response");
const fs = require("fs");


///image empty,invalid file format,error on moving file
const imageUpload = (req, res, filename) => {

    if (!req.files || Object.keys(req.files).length === 0)
        return response({ res, msg: "Successfully updated" });

    const file = req.files.image;

    const path = `./uploads/${filename}.jpg`;
    file.mv(path, err => {
        if (err) return response({ res, code: 500, msg: err })
    });

    return response({ res, data: { _id: filename }, msg: "Success" });
}

const deleteImage = (filename) => {
    ///remove uploaded file
    fs.unlinkSync(`./uploads/${filename}.jpg`);
}




module.exports.image = {
    upload: imageUpload,
    delete: deleteImage
}

module.exports.isFileExist = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0)
        return response({ res, code: 400, msg: "File is empty" });
    next();
}

module.exports.isFileTypeValid = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) //no file
        return next();
    const file = req.files.image;
    if (!(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"))
        return response({ res, code: 403, msg: "Invalid file format" });
    next();
}

