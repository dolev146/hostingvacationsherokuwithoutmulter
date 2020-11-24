const Query = require("../db")

const handleResAll = async (req, res , user_id) => {

    // giving back filtered orders
    q = `SELECT vacations.id as id , vacations.descrip as descrip  , vacations.dest as dest , vacations.picture as picture , vacations.dept as dept ,
vacations.arv as arv , vacations.price as price , orders.user_id as follower_id  FROM vacations 
LEFT JOIN orders ON orders.vacation_id = vacations.id where orders.user_id = ? group by orders.vacation_id order by orders.vacation_id`
    let Followed_vacations = await Query(q, [user_id])

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
}

const handleResFollowed = async (user_Id) => {
    // giving back filtered orders
    q = `SELECT vacations.id as id , vacations.descrip as descrip  , vacations.dest as dest , vacations.picture as picture , vacations.dept as dept ,
    vacations.arv as arv , vacations.price as price , orders.user_id as follower_id  FROM vacations 
    LEFT JOIN orders ON orders.vacation_id = vacations.id where orders.user_id = ? group by orders.vacation_id order by orders.vacation_id`
    let Followed_vacations = await Query(q, [user_Id])
    res.json(Followed_vacations)
}

module.exports = {
    handleResAll,
    handleResFollowed
}