const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/myChat/:userId', (req, res) => {
    const userId = req.params.userId;

    pool.query('SELECT * FROM chat WHERE user_id = $1', [userId], 
        (error, results) => {
        if (error) {
            res.status(500).json({
                Error: error.detail
            });
        };

        res.status(200).json({
            count: results.rows.length,
            chats: results.rows
        });
    });
});

router.get('/checkUserExists/:userId/:receiverId', (req, res) => {
    const userId = req.params.userId;
    const receiverId = req.params.receiverId;

    pool.query(`SELECT * FROM chat WHERE user_id = $1 AND
        chat_receiver_id = $2`, [userId, receiverId],
        (error, results) => {
        if (error) {
            res.status(500).json({
                Error: error.detail
            });
        };

        if (results.rows.length) {
            res.json({
                user_exists: 'This is user is already in your chat!',
                chat: results.rows[0]
            });
        } else {
            res.status(404).json({
                not_found: 'User does not exist in your chat!'
            });
        };
    });
});

router.post('/createChat/:userId/:receiverId', (req, res) => {
    const userId = req.params.userId;
    const receiverId = req.params.receiverId;

    const { user_name, user_photo, chat_receiver_name, 
    chat_receiver_photo, last_message, last_message_time } = req.body;

    pool.query(`INSERT INTO chat (user_id, chat_receiver_id,
        last_message, last_message_time, user_name, user_photo,
        chat_receiver_name, chat_receiver_photo) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [userId, receiverId, last_message, last_message_time, 
        user_name, user_photo, chat_receiver_name, 
        chat_receiver_photo],
        (error, results) => {
        if (error) {
            res.status(500).json({
                Error: error.detail
            });
        };

        res.status(201).json({
            Success: 'Chat created successfully!'
        });
    });
});

router.put('/updateLastMessage/:chatId', (req, res) => {
    const chatId = req.params.chatId;
    const { last_message } = req.body;

    pool.query('UPDATE chat SET last_message = $1 WHERE id = $2',
    [last_message, chatId], (error, results) => {
        if (error) {
            res.status(500).json({
                Error: error.detail
            });
        };

        res.json({
            Success: 'Chat updated successfully!'
        });
    });
});

router.put('/updateLastMessageTime/:chatId', (req, res) => {
    const chatId = req.params.chatId;
    const { last_message_time } = req.body;

    pool.query('UPDATE chat SET last_message_time = $1 WHERE id = $2',
    [last_message_time, chatId], (error, results) => {
        if (error) {
            res.status(500).json({
                Error: error.detail
            });
        };

        res.json({
            Success: 'Chat updated successfully!'
        });
    });
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