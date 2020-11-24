let router = require("express").Router()
let jwt = require("jsonwebtoken")
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const Query = require("../db")



// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { fname, lname, username, password } = req.body
        //check body validity
        let user = await Query(`SELECT * FROM users WHERE username = ?`, [username])
        if (fname && lname && username && password) {
            //check if user already exist
            if (!user.length) {
                const salt = genSaltSync(10)
                const hash = hashSync(password, salt)

                let q = `INSERT INTO users(fname, lname, username, password)
               VALUES(?, ? , ? , ? )`
                let results = await Query(q, [fname, lname, username, hash])
                res.status(201).json({ error: false, msg: "username added successfully" })
            } else {
                res.status(400).json({ error: true, msg: "username already taken" })
            }
        } else {
            res.status(400).json({ error: true, msg: "missing some imfo" })
        }
    } catch (error) {
        res.sendStatus(500)
    }
})


// LOGIN
router.post("/login", async (req, res) => {
    const { username, password } = req.body
    // data exist
    if (username && password) {
        try {
            let q = `SELECT * FROM users WHERE username = ?`
            let user = await Query(q, [username])
            console.log(user)
            if (user.length) {
                // password match
                if (compareSync(password, user[0].password)) {
                    let access_token = jwt.sign({ id: user[0].id, fname: user[0].fname, role: user[0].role }, "BlAh", {
                        expiresIn: "10m"
                    })
                    let refresh_token = jwt.sign({ id: user[0].id }, "refresh", {
                        expiresIn: "7d"
                    })
                    res.status(200).json({ error: false, access_token, refresh_token, userid: user[0].id })
                } else {
                    res.status(401).json({ error: true, msg: "wrong password" })
                }
            } else {
                res.status(401).json({ error: true, msg: "user not found" })
            }

        } catch (error) {
            res.sendStatus(500)
        }

    } else {
        res.status(400).json({ error: true, msg: "missing some imfo" })
    }

})


router.post("/refresh", (req, res) => {
    const { token } = req.body
    jwt.verify(token, "refresh", (err, user) => {
        if (err) {
            res.sendStatus(401)
        } else {
            let curruser = users[user.id - 1]
            if (curruser.refresh === token) {
                let access_token = jwt.sign({ id: curruser.id, fname: curruser.fname, role: curruser.role }, "BlAh", {
                    expiresIn: "10m"
                })
                res.json({ error: false, access_token })
            } else {
                res.sendStatus(403)
            }
        }
    })
})

// LOGOUT
router.get("/logout/:id", (req, res) => {
    delete users[req.params.id - 1].refresh
})

module.exports = router



