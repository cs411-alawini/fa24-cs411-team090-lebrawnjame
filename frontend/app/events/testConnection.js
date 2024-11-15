// testConnection.js
import mysql from 'mysql2/promise';

async function testConnection() {
    const connection = await mysql.createConnection({
        host: '35.226.113.165',
        user: 'dev',
        password: 'hello',
        database: 'lephoningdbtest'
    });

    try {
        console.log("Connected to the database. Executing query...");
        const [rows] = await connection.execute('SELECT EventID as id, EventName as title, StartDate as start, EndDate as end FROM Events');
        console.log("Query results:", rows);
    } catch (error) {
        console.error("Database query error:", error);
    } finally {
        connection.end();
        console.log("Database connection closed.");
    }
}

testConnection();
