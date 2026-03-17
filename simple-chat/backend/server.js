const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Users map
let users = {}; // { userId: socketId }

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    users[userId] = socket.id;
    console.log("User joined:", userId);
  });

  socket.on("send_message", async (data) => {
    try {
      // Save message to DB
      const message = new Message({
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
      });
      await message.save();

      const receiverSocket = users[data.receiverId];
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", data);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    // Remove user from users map
    const userId = Object.keys(users).find(key => users[key] === socket.id);
    if (userId) {
      delete users[userId];
      console.log("User disconnected:", userId);
    }
  });
});

// API Routes
app.get('/api/messages/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});