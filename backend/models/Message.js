const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true, // Ensures the user field is always provided
            trim: true, // Removes unnecessary spaces
        },
        message: {
            type: String,
            required: true, // Ensures the message field is always provided
            trim: true, // Removes unnecessary spaces
        },
        timestamp: {
            type: Date,
            default: Date.now, // Automatically assigns the current date/time
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

// Create the Message model
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
