const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/myMessages/:userId/:receiverId', (req, res) => {
    const userId = req.params.userId;
    const receiverId = req.params.receiverId;

    pool.query(`SELECT * FROM message WHERE sender_id = $1 AND
        receiver_id = $2 OR sender_id = $2 AND receiver_id = $1
        ORDER BY timestamp`, 
        [userId, receiverId], (error, results) => {
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

router.get('/lastMessage/:userId/:receiverId', (req, res) => {
    const userId = req.params.userId;
    const receiverId = req.params.receiverId;

    pool.query(`SELECT * FROM message WHERE sender_id = $2 AND
        receiver_id = $1 ORDER BY timestamp DESC LIMIT 1`, 
        [userId, receiverId], (error, results) => {
            if (error) {
                res.status(500).json({
                    Error: error.detail
                });
            };

            res.status(200).json({
                count: results.rows.length,
                message: results.rows[0]
            });
        }
    );
});

router.get('/unread/:userId/:receiverId', (req, res) => {
    const userId = req.params.userId;
    const receiverId = req.params.receiverId;

    pool.query(`SELECT * FROM message WHERE sender_id = $1 AND
        receiver_id = $2 AND seen = false`, [receiverId, userId],
        (error, results) => {
        if (error) {
            res.status(500).json({
                Error: error.detail
            });
        };

        res.status(200).json({
            count: results.rows.length
        });
    });
});

router.post('/sendMessage/:senderId/:receiverId', (req, res) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;

    const { content } = req.body;

    pool.query(`INSERT INTO message (sender_id, receiver_id,
        content) VALUES ($1, $2, $3) RETURNING *`, 
        [senderId, receiverId, content], (error, results) => {
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

router.put('/updateSeen/:messageId', (req, res) => {
    const messageId = req.params.messageId;
    const { seen } = req.body;

    pool.query('UPDATE message SET seen = $1 WHERE id = $2', 
        [seen, messageId], (error, results) => {
        if (error) {
            res.status(500).json({
                Error: error.detail
            });
        };

        res.json({
            Success: 'Message updated successfully!'
        });
    });
});

module.exports = router;