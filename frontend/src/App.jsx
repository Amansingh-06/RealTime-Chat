import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/Message';
import axios from 'axios';

const socket = socketIOClient('http://localhost:3000'); // Backend URL

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState('User1'); // Example username

  useEffect(() => {
    // Fetch existing messages
    axios.get('http://localhost:3000/api/chat/messages')
      .then((response) => setMessages(response.data))
      .catch((err) => console.error(err));

    // Listen for new messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for deleted messages
    socket.on('messageDeleted', (messageId) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('messageDeleted');
    };
  }, []);

  // Send a new message
  const sendMessage = (message) => {
    const messageData = { user: userName, message };
    socket.emit('sendMessage', messageData);
  };

  // Delete a message
  const deleteMessage = (messageId) => {
    socket.emit('deleteMessage', messageId);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden bg-gray-200 p-4">
        <ChatWindow messages={messages} onDeleteMessage={deleteMessage} />
      </div>
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default App;
