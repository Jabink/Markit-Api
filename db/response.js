module.exports = function ({res, code=200, msg="", data=""} = {}) {
    return res.status(code).json({
        msg,
        data
    })
}


