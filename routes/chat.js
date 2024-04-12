const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/myChat/:ownerId', (req, res) => {
    const ownerId = req.params.ownerId;

    pool.query('SELECT * FROM chat WHERE ownerId = $1', [ownerId],
        (error, results) => {
            if (error) {
                res.status(500).json({
                    Error: error.detail
                });
            };

            res.status(200).json({
                chat: results.rows
            });
        }
    );
});

router.post('/addToChat', (req, res) => {
    const { ownerId, userId } = req.body;

    //Checking if the user is already in the chat
    //If he is, we throw an error, otherwise we add him to chat
    pool.query(`SELECT * FROM chat WHERE ownerId = $1 AND userId = $2 OR userId = $1 AND 
        ownerId = $2`,
        [ownerId, userId], (error, results) => {
            if (error) {
                res.status(500).json({
                    Error: error.detail
                });
            };

            if (results.rows.length) {
                res.status(500).json({
                    Error: 'User already in chat!'
                });
            } else {
                pool.query('INSERT INTO chat (ownerId, userId) VALUES ($1, $2)',
                    [ownerId, userId], (error, results) => {
                        if (error) {
                            res.status(500).json({
                                Error: error.detail
                            });
                        };

                        res.status(201).json({
                            Success: 'Chat created successfully!'
                        });
                    }
                );
            };
        }
    );
});

router.delete('/deleteChat/:id', (req, res) => {
    const chatId = req.params.id;

    pool.query('DELETE FROM chat WHERE id = $1', [chatId],
        (error, results) => {
            if (error) {
                res.status(500).json({
                    Error: error.detail
                });
            };

            res.json({
                Success: 'Chat deleted successfully!'
            });
        }
    );
});

module.exports = router;