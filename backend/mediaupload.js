const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

const connection = mysql.createConnection({
    host: '35.226.113.165',
    user: 'dev',
    password: 'hello',
    database: 'lephoningdbtest'
});
connection.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists on the server
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Endpoint to upload media
app.post('/api/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const { type, alt } = req.body; // type can be 'image' or 'video'
    const src = `/uploads/${req.file.filename}`;

    // Insert media metadata into the database
    const query = 'INSERT INTO Media (type, src, alt) VALUES (?, ?, ?)';
    const values = [type, src, alt || null];
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Error inserting media:", err);
            return res.status(500).json({ error: "Failed to save media to database" });
        }
        res.status(201).json({ message: "Media uploaded successfully", id: result.insertId });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
