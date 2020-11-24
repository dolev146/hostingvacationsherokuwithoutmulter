const mysql = require("mysql");

var dbConfig = {
    host: "eu-cdbr-west-03.cleardb.net",
    user: "b2a04685658a7e",
    password: "29775728",
    database: "heroku_678683cc48995d6"
};

var connection;
function handleDisconnect() {
    connection = mysql.createConnection(dbConfig);  // Recreate the connection, since the old one cannot be reused.
    connection.connect(function onConnect(err) {   // The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
        }                                           // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function onError(err) {
        console.log('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            console.log("connection lost")
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();

// let db = mysql.createConnection({
//     host: "eu-cdbr-west-03.cleardb.net",
//     user: "b2a04685658a7e",
//     password: "29775728",
//     database: "heroku_678683cc48995d6"
// })



let Query = (q, params) => {
    return new Promise((resolve, reject) => {
        connection.query(q, params, (err, results) => {
            if (err) {
                reject(err)
                console.log(err)
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = Query
