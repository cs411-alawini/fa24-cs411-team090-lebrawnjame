// // pages/api/getEvents.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }

    // pages/api/getEvents.js
        const connection = await mysql.createConnection({
            host: '35.226.113.165',
            user: 'dev',
            password: 'hello',
            database: 'lephoningdbtest'
        });


    try {
        console.log("Executing query in getEvents API...");
        const [rows] = await connection.execute('SELECT EventID as id, EventName as title, StartDate as start, EndDate as end FROM Events');
        console.log("Query results:", rows);
        res.status(200).json(rows);  // Return the query results as JSON
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ message: 'Database query error', error });
    } finally {
        connection.end();
        console.log("Database connection closed in getEvents API.");
    }
}