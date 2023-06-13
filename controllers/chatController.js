const { ObjectId } = require('mongodb');

// Function to handle chat-related functionality
const chatController = (io, chatCollection) => {
//   const chatCollection = db.collection('messages');

  // Socket.IO event handlers
  io.on('connection', socket => {
    console.log('New client connected');

    // Handle new chat message
    socket.on('newMessage', data => {
      const { sender, recipient, message } = data;
      const timestamp = new Date();

      const chatMessage = {
        sender,
        recipient,
        message,
        timestamp,
      };

      // Store the message in the MongoDB collection
      chatCollection
        .insertOne(chatMessage)
        .then(() => {
          // Emit the message to the recipient client
          socket.to(recipient).emit('newMessage', chatMessage);
        })
        .catch(error => {
          console.error('Error storing message:', error);
        });
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = chatController;
