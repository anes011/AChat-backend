const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/myChat/:userId', (req, res) => {
    const userId = req.params.userId;

    pool.query(`SELECT * FROM chat WHERE creator_id = $1 OR
        chat_receiver_id = $1`, [userId], 
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

router.get('/chatById/:chatId', (req, res) => {
    const chatId = req.params.chatId;

    pool.query('SELECT * FROM chat WHERE id = $1', [chatId],
        (error, results) => {
        if (error) {
            res.status(500).json({
                Error: error.detail
            });
        };

        res.status(200).json({
            chat: results.rows[0]
        });
    });
});

router.post('/createChat/:creatorId/:receiverId', (req, res) => {
    const creatorId = req.params.creatorId;
    const receiverId = req.params.receiverId;

    const { user_name, user_photo, chat_receiver_name, 
    chat_receiver_photo } = req.body;

    pool.query(`INSERT INTO chat (creator_id, chat_receiver_id, 
        user_name, user_photo, chat_receiver_name, chat_receiver_photo) 
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [creatorId, receiverId, user_name, user_photo, 
        chat_receiver_name, chat_receiver_photo],
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