const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const Message = require('./models/Message');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5174", // React Frontend URL
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const chatRoutes = require('./Routes/ChatRooms'); // Placeholder for additional routes
app.use('/api/chat', chatRoutes);

// Socket.IO for real-time messaging
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listen for message send
    socket.on('sendMessage', async (messageData) => {
        try {
            // Save the message to MongoDB
            const message = new Message(messageData);
            const savedMessage = await message.save();

            // Broadcast the message to all connected clients
            io.emit('receiveMessage', savedMessage);
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });

    // Listen for message delete
    socket.on('deleteMessage', async (messageId) => {
        try {
            await Message.findByIdAndDelete(messageId); // Delete message from MongoDB
            io.emit('messageDeleted', messageId); // Notify all clients
        } catch (err) {
            console.error('Error deleting message:', err);
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error middleware:', err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
