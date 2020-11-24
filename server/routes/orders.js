let router = require("express").Router()
const { verifyUser, verifyAdmin } = require("../verify")
const Query = require("../db")
const { handleResAll, handleResFollowed } = require("./handleRes") 


// place order
router.post("/", verifyUser, async (req, res) => {
    console.log("follow")
    try {
        const { userId, vacationId, show } = req.body
        console.log(show)
        if (userId && vacationId) {
            // placing the order
            let q = `INSERT INTO orders (user_id , vacation_id)
                        VALUES(? , ?)`
            await Query(q, [userId, vacationId])



            // if (show === "All") {
            //     handleResAll(userId)
            // } else if (show === "Followed") {
            //     handleResFollowed(userId)
            // }


            if (show === "All") {


                // giving back filtered orders
                q = `SELECT vacations.id as id , vacations.descrip as descrip  , vacations.dest as dest , vacations.picture as picture , vacations.dept as dept ,
vacations.arv as arv , vacations.price as price , orders.user_id as follower_id  FROM vacations 
LEFT JOIN orders ON orders.vacation_id = vacations.id where orders.user_id = ? group by orders.vacation_id order by orders.vacation_id`
                let Followed_vacations = await Query(q, [userId])

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


            } else if (show === "Followed") {
                // giving back filtered orders
                q = `SELECT vacations.id as id , vacations.descrip as descrip  , vacations.dest as dest , vacations.picture as picture , vacations.dept as dept ,
                 vacations.arv as arv , vacations.price as price , orders.user_id as follower_id  FROM vacations 
                 LEFT JOIN orders ON orders.vacation_id = vacations.id where orders.user_id = ? group by orders.vacation_id order by orders.vacation_id`
                let Followed_vacations = await Query(q, [userId])
                res.json(Followed_vacations)
            }
        } else {
            res.status(400).json({ error: true, msg: "missing some info Brother " })
        }
    } catch (error) {
        res.sendStatus(500)
    }
})

// delete order
router.post("/delete", verifyUser, async (req, res) => {
    console.log("unfollow")
    const { userId, vacationId, show } = req.body
    if (userId && vacationId) {
        try {
            // deleting the order
            let q = `DELETE FROM orders 
            WHERE user_id = ?  AND vacation_id = ?`
            await Query(q, [userId, vacationId])

            if (show === "All") {



                // handleRes(userId)


                // giving back filtered orders
                q = `SELECT vacations.id as id , vacations.descrip as descrip  , vacations.dest as dest , vacations.picture as picture , vacations.dept as dept ,
                vacations.arv as arv , vacations.price as price , orders.user_id as follower_id  FROM vacations 
                LEFT JOIN orders ON orders.vacation_id = vacations.id where orders.user_id = ? group by orders.vacation_id order by orders.vacation_id`
                let Followed_vacations = await Query(q, [userId])

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


            } else if (show === "Followed") {
                // giving back filtered orders
                q = `SELECT vacations.id as id , vacations.descrip as descrip  , vacations.dest as dest , vacations.picture as picture , vacations.dept as dept ,
                vacations.arv as arv , vacations.price as price , orders.user_id as follower_id  FROM vacations 
                LEFT JOIN orders ON orders.vacation_id = vacations.id where orders.user_id = ? group by orders.vacation_id order by orders.vacation_id`
                let Followed_vacations = await Query(q, [userId])
                res.json(Followed_vacations)
            }

        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info Neshama" })
    }
})

router.get("/", verifyAdmin, async (req, res) => {
    try {
        let q = `
        SELECT users.* , vacations.* 
        FROM orders
        INNER JOIN users ON orders.user_id = users.id
        INNER JOIN vacations ON orders.vacation_id = vacations.id
        `
        let orders = await Query(q)
        res.json(orders)
    } catch (err) {
        res.sendStatus(500)
    }
})

router.get("/:id", verifyUser, async (req, res) => {
    try {
        let q = `
        SELECT users.fname , users.lname , vacations.descrip, vacations.dest 
        FROM orders
        INNER JOIN users ON orders.user_id = users.id
        INNER JOIN vacations ON orders.vacation_id = vacations.id
        WHERE orders.user_id = ?
        `
        let orders = await Query(q, [req.params.id])
        res.json(orders)
    } catch (err) {
        res.sendStatus(500)
    }
})

router.post("/reports", verifyAdmin, async (req, res) => {
    try {
        let q = `
        SELECT f.dest AS dest, COUNT(o.user_id) AS followers
        FROM orders AS o 
        JOIN vacations AS f ON o.vacation_id = f.id GROUP BY vacation_id HAVING followers > 0
        `
        let ordersByFollowers = await Query(q)
        res.json(ordersByFollowers)
    } catch (error) {
        res.sendStatus(500)
    }
})

module.exports = router