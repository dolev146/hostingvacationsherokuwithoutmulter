const router = require("express").Router()
const { verifyAdmin, verifyUser } = require("../verify")
const { deleteOrdersConnected } = require("./deleteOrdersConnected")
const Query = require("../db")



// get all vacations - all
router.get("/", async (req, res) => {
    try {
        let q = `SELECT * FROM vacations `
        let vacations = await Query(q)
        res.json(vacations)
    } catch (error) {
        res.sendStatus(500)
    }
})

// get filtered vacations - all
router.get("/regular/:id", verifyUser, async (req, res) => {
    try {
        let q = `SELECT vacations.id as id , vacations.descrip as descrip  , vacations.dest as dest , vacations.picture as picture , vacations.dept as dept ,
        vacations.arv as arv , vacations.price as price , orders.user_id as follower_id  FROM vacations 
        LEFT JOIN orders ON orders.vacation_id = vacations.id where orders.user_id = ? group by orders.vacation_id order by orders.vacation_id`
        let Followed_vacations = await Query(q, [req.params.id])

        // declare so i can use in this scope
        let Unfollowed_vacations;

        if (!Followed_vacations.length) {
            // give me all vacations
            q = ` SELECT vacations.id as id , vacations.descrip as descrip  , vacations.dest as dest , vacations.picture as picture , vacations.dept as dept ,
        vacations.arv as arv , vacations.price as price , orders.user_id as follower_id FROM vacations 
         LEFT JOIN orders ON orders.vacation_id = vacations.id group by vacations.id order by orders.vacation_id `
            Unfollowed_vacations = await Query(q)
            res.json(Unfollowed_vacations)

        }
        // else check what is happening in the vacations i dont follow
        else {
            let vacationsNumberToNotFollow = Followed_vacations.map(v => v.id)
            q = ` SELECT vacations.id as id , vacations.descrip as descrip  , vacations.dest as dest , vacations.picture as picture , vacations.dept as dept ,
            vacations.arv as arv , vacations.price as price , orders.user_id as follower_id FROM vacations 
            LEFT JOIN orders ON orders.vacation_id = vacations.id where vacations.id NOT IN (?) group by vacations.id order by orders.vacation_id `
            Unfollowed_vacations = await Query(q, [[...vacationsNumberToNotFollow]])
        }
        // check the image that describe the project to see the logic behind this call
        if (!Unfollowed_vacations.length) {
            res.json(Followed_vacations)
        }
        if (Unfollowed_vacations.length && Followed_vacations.length) {
            let all_vacations = [...Followed_vacations.concat(Unfollowed_vacations)]
            const compare = (a, b) => {
                if (a.id > b.id) return 1;
                if (b.id > a.id) return -1;
                return 0;
            };
            let sortedArray = all_vacations.sort(compare)
            res.json(sortedArray)
        }
    } catch (error) {
        res.sendStatus(500)
    }
})

// get filtered vacations - only followed
router.get("/followed/:id", verifyUser, async (req, res) => {
    try {
        let q = `SELECT vacations.id as id , vacations.descrip as descrip  , vacations.dest as dest , vacations.picture as picture , vacations.dept as dept ,
        vacations.arv as arv , vacations.price as price , orders.user_id as follower_id  FROM vacations 
        LEFT JOIN orders ON orders.vacation_id = vacations.id where orders.user_id = ? group by orders.vacation_id order by orders.vacation_id`
        let Followed_vacations = await Query(q, [req.params.id])
        if (Followed_vacations.length) {
            console.log(Followed_vacations)
            res.json(Followed_vacations)
        } else {
            res.json({ error: true, msg: "no followed vacations" })
        }
    } catch (error) {
        res.sendStatus(500)
    }
})

router.get("/:id", async (req, res) => {
    try {
        let q = `SELECT * FROM vacations WHERE id = ?`
        let vacation = await Query(q, [req.params.id])
        res.json(vacation)
    } catch (err) {
        res.sendStatus(500)
    }
})


// add vacation - admin 
router.post("/add", verifyAdmin, async (req, res) => {
    const { descrip, dest, picture, dept, arv, price } = req.body
    if (descrip && dest && picture && dept && arv && price) {
        let q = `INSERT INTO vacations(descrip, dest, picture, dept, arv, price)
        VALUES (?, ?, ?, ?, ?, ?)`
        try {
            let result = await Query(q, [descrip, dest, picture, dept, arv, price])
            let vacations = await Query(`SELECT * FROM vacations`)
            res.json(vacations)
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ err: true, msg: "missing some info" })
    }
})

// delete vacation - admin 
router.delete("/:id", verifyAdmin, deleteOrdersConnected, async (req, res) => {
    try {
        let q = `DELETE FROM vacations WHERE id = ?`
        let results = await Query(q, [req.params.id])
        let vacations = await Query(`SELECT * FROM vacations`)
        res.json(vacations)
    } catch (error) {
        res.sendStatus(500)
    }

})

// edit vacation - admin 
router.put("/:id", verifyAdmin, async (req, res) => {
    const { descrip, dest, dept, arv, price } = req.body
    try {
        let q = `UPDATE vacations SET descrip = ?, dest = ?, dept = ?, arv = ?, price = ? 
        WHERE id = ?`
        let results = await Query(q, [descrip, dest, dept, arv, price, req.params.id])
        let vacations = await Query(`SELECT * FROM vacations`)
        res.json(vacations)
    } catch (error) {
        res.sendStatus(500)
    }
})






module.exports = router