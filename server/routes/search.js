let router = require("express").Router()
const querystring = require('querystring');
const Query = require("../db")


router.get("/", async (req, res) => {
    try {
        const { Checkin, CheckOut, TexttoSearch } = req.query
        let q = `select * from vacations
        where (descrip LIKE ? )
        and( arv between ? and ? ) 
        and ( dept between ? and ? ) `
        let result = await Query(q, ["%" + TexttoSearch + "%", Checkin, CheckOut,Checkin, CheckOut])
        res.json(result)
    } catch (error) {
        res.sendStatus(500)
    }
})















module.exports = router