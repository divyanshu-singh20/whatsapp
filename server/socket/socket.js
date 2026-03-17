const User = require('../models/User');

module.exports = (io) => {
  const users = {};

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins
    socket.on('join', async (userId) => {
      users[userId] = socket.id;
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit('userOnline', userId);
    });

    // Send message
    socket.on('sendMessage', (data) => {
      const { chatId, message } = data;
      socket.to(chatId).emit('receiveMessage', message);
    });

    // Join chat room
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { chatId, userId } = data;
      socket.to(chatId).emit('userTyping', userId);
    });

    socket.on('stopTyping', (data) => {
      const { chatId, userId } = data;
      socket.to(chatId).emit('userStopTyping', userId);
    });

    // Disconnect
    socket.on('disconnect', async () => {
      const userId = Object.keys(users).find(key => users[key] === socket.id);
      if (userId) {
        delete users[userId];
        await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
        io.emit('userOffline', userId);
      }
      console.log('User disconnected:', socket.id);
    });
  });
};