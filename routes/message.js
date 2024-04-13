const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/myMessages/:firstUser/:secondUser', (req, res) => {
    const firstUser = req.params.firstUser;
    const secondUser = req.params.secondUser;

    pool.query(`SELECT * FROM message WHERE sender = $1 AND
        receiver = $2 OR receiver = $1 AND sender = $2`, 
        [firstUser, secondUser], (error, results) => {
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
    const { senderId, receiverId, textMessage, photoMessage, 
    videoMessage, audioMessage } = req.body;

    pool.query(`INSERT INTO message (sender, receiver, text_message,
        photo_message, video_message, audio_message) VALUES ($1, 
        $2, $3, $4, $5, $6)`, [senderId, receiverId, textMessage,
        photoMessage, videoMessage, audioMessage], (error, results) => {
            if (error) { 
                res.status(500).json({
                    Error: error.detail
                }) 
            };

            res.status(201).json({
                Success: 'Message sent successfully!'
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