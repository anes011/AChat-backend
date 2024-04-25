const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/myMessages/:chatId', (req, res) => {
    const chatId = req.params.chatId;

    pool.query('SELECT * FROM message WHERE chat_id = $1', 
        [chatId], (error, results) => {
            if (error) {
                res.status(500).json({
                    Error: error.detail
                });
            };

            res.status(200).json({
                count: results.rows.length,
                messages: results.rows
            });
        }
    );
});

router.post('/sendMessage', (req, res) => {
    const { sender, receiver, text_message,
    chat_id, sender_photo, receiver_photo } = req.body;

    pool.query(`INSERT INTO message (sender, receiver, text_message,
        chat_id, sender_photo, receiver_photo) VALUES ($1, 
        $2, $3, $4, $5, $6) RETURNING *`, [sender, receiver, text_message,
        chat_id, sender_photo, receiver_photo], (error, results) => {
            if (error) { 
                res.status(500).json({
                    Error: error.detail
                }) 
            };

            res.status(201).json({
                Success: 'Message sent successfully!',
                message: results.rows[0]
            });
        }
    );
});

router.put('/updateStatus/:messageId', (req, res) => {
    const messageId = req.params.messageId;
    const { status } = req.body;

    pool.query(`UPDATE message SET status = $1 WHERE id = $2`, [status, messageId],
        (error, results) => {
            if (error) {
                res.status(500).json({
                    Error: error.detail
                });
            };

            res.json({
                Success: 'Message status updated!'
            });
        }
    );
});

module.exports = router;