const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const router = express.Router();
const connection = mysql.createConnection({
    host: '35.226.113.165',
    user: 'dev',
    password: 'hello',
    database: 'lephoningdbtest'
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connected to the database");
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    connection.query(
        'SELECT * FROM User WHERE Email = ?',
        [email],
        async (err, results) => {
            if (err) return res.status(500).send('Server error');
            if (results.length === 0) return res.status(400).send('User not found');

            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.Password);

            if (passwordMatch) {
                const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
                res.status(200).json({ message: 'Login successful', token });
            } else {
                res.status(400).send('Incorrect password');
            }
        }
    );
});

router.post('/signup', async (req, res) => {
    const { username, email, password, membershipStatus, location } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
        Username: username,
        Email: email,
        Password: hashedPassword,
        MembershipStatus: membershipStatus || 0,
        Location: location || 1
    };

    connection.query('INSERT INTO User SET ?', userData, (err, results) => {
        if (err) return res.status(500).send('Server error');
        res.status(201).send('User created');
    });
});

module.exports = router;
