const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/myChat/:userId', (req, res) => {
    const userId = req.params.userId;

    pool.query('SELECT * FROM chat WHERE chatter_id = $1 OR receiver_id = $1', [userId],
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
    const { chatterId, receiverId } = req.body;

    //Checking if both users are already in the chat
    //If they are, we throw an error, otherwise we add them to chat
    pool.query(`SELECT * FROM chat WHERE chatter_id = $1 AND 
        receiver_id = $2 OR receiver_id = $1 AND chatter_id = $2`,
        [chatterId, receiverId], (error, results) => {
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
                pool.query('INSERT INTO chat (chatter_id, receiver_id) VALUES ($1, $2)',
                    [chatterId, receiverId], (error, results) => {
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