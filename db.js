const db = require("mysql");
const connection = db.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database:"ilab2"
});

connection.connect(function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("connection established");
});

module.exports = connection;