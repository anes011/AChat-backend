const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

router.get('/allUsers', (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            res.status(500).json({
                Error: error.detail
            });
        };

        res.status(200).json({
            count: results.rows.length,
            users: results.rows
        });
    });
});

//Cloudinary config
cloudinary.config({ 
    cloud_name: 'dlhjhg5yh', 
    api_key: '887992126494528', 
    api_secret: 'Jc9ZOx2UIVJEtfnb36w5hcGlb2I' 
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary
});

const upload = multer({ storage: storage });
//

router.post('/addUser', upload.single('photo'), (req, res) => {
    const user = ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone_number: req.body.phone_number,
        photo: req.file.path
    });

    bcrypt.hash(user.password, 10, function(err, hash) {
        pool.query(`INSERT INTO users (name, email, password, 
            phone_number, photo) VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
            [user.name, user.email, hash, user.phone_number, user.photo], 
            (error, results) => {
            if (error) {
                res.status(500).json({
                    Error: error.detail
                })
            }
            
            res.status(201).json({
                Success: 'User added successfully!',
                user: results.rows[0]
            });
        });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    pool.query('SELECT * FROM users WHERE email = $1', [email],
        (error, results) => {
            if (error) {
                res.status(500).json({
                    Error: error.detail
                });
            };

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
                            userId: results.rows[0].id
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

router.put('/changePhoto/:id', (req, res) => {
    const userId = req.params.id;
    const { photo } = req.body;

    pool.query('UPDATE users SET photo = $1 WHERE id = $2', [photo, userId],
        (error, results) => {
            if (error) {
                res.status(500).json({
                    Error: error.detail
                });
            };

            res.json({
                Success: 'User photo updated successfully!'
            });
        }
    );
});

router.delete('/deleteUser/:id', (req, res) => {
    const userId = req.params.id;

    pool.query('DELETE FROM users WHERE id = $1', [userId], 
        (error, results) => {
        if (error) {
            res.status(500).json({
                Error: error.detail
            });
        };

        res.json({
            Success: 'User deleted successfully!'
        });
    });
});

module.exports = router;