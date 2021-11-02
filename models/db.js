const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

//creating connection to databse
const conn = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

//opening connection

conn.connect(err => {
    if(err) throw err;
    console.log("Connected to database "+ dbConfig.DB);
});

module.exports = conn;