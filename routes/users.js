const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

router.get('/allUsers', (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        res.status(200).json({
            count: results.rows.length,
            users: results.rows
        });
    });
});

router.post('/addUser', (req, res) => {
    const { name, email, password, phone_number } = req.body;

    bcrypt.hash(password, 10, function(err, hash) {
        pool.query(`INSERT INTO users (name, email, password, phone_number) 
            VALUES ($1, $2, $3, $4)`, [name, email, hash, 
            phone_number], (error, results) => {
            if (error) throw error;
            
            res.status(201).json({
                Success: 'User added successfully!'
            });
        });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    pool.query('SELECT * FROM users WHERE email = $1', [email],
        (error, results) => {
            if (error) throw error;

            if (!results.rows.length) {
                res.status(404).json({
                    Error: 'No user with this email was found!'
                });
            } else {
                bcrypt.compare(password, results.rows[0].password, 
                    function(err, result) {
                    if (result) {
                        res.status(200).json({
                            Success: 'Logged-in successfully!',
                            user: results.rows[0]
                        });
                    } else {
                        res.status(400).json({
                            Error: 'Wrong password, feel free to try again!'
                        });
                    };
                });
            };
        }
    );
});

router.delete('/deleteUser/:id', (req, res) => {
    const userId = req.params.id;

    pool.query('DELETE FROM users WHERE id = $1', [userId], 
        (error, results) => {
        if (error) throw error;

        res.json({
            Success: 'User deleted successfully!'
        });
    });
});

module.exports = router;