const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages from the database
router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// Save a new message to the database
router.post('/messages', async (req, res) => {
    const { user, message } = req.body;

    if (!user || !message) {
        return res.status(400).json({ message: 'User and message fields are required' });
    }

    const newMessage = new Message({ user, message });

    try {
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ message: 'Error saving message' });
    }
});

// Delete a message by ID
router.delete('/messages/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMessage = await Message.findByIdAndDelete(id);

        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully', id });
    } catch (err) {
        console.error('Error deleting message:', err);
        res.status(500).json({ message: 'Error deleting message' });
    }
});

module.exports = router;
