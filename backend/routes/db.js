const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '35.226.113.165',
    user: 'dev',
    password: 'hello',
    database: 'lephoningdbtest'
});

connection.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to the database");
});

module.exports = connection;
