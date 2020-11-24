const jwt = require("jsonwebtoken")

const verifyUser = (req, res, next) => {
    // has token
    if (req.header("Authorization")) {
        // if token valid
        jwt.verify(req.header("Authorization"), "BlAh", (err, user) => {
            if (err) {
                res.status(403).json({ error: true, msg: "token not valid" })
            } else {
                req.user = user
                next()
            }
        })
    } else {
        res.status(401).json({ error: true, msg: "token expected" })
    }
}

const verifyAdmin = (req, res, next) => {
    // has token
    if (req.header("Authorization")) {
        // if token valid
        jwt.verify(req.header("Authorization"), "BlAh", (err, user) => {
            if (err) {
                res.status(403).json({ error: true, msg: "token not valid" })
            } else {
                // is admin
                if (user.role === "admin") {
                    req.user = user
                    next()
                } else {
                    res.status(403).json({ error: true, msg: "tour still not admin try again next year" })
                }
            }
        })
    } else {
        res.status(401).json({ error: true, msg: "token expected" })
    }
}


module.exports = {
    verifyUser,
    verifyAdmin
}