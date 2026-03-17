const Chat = require('../models/Chat');
const User = require('../models/User');

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.user.id })
      .populate('members', 'name profilePic isOnline lastSeen')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    // Create new chat
    const chat = new Chat({
      members: [senderId, receiverId],
    });

    await chat.save();
    await chat.populate('members', 'name profilePic isOnline lastSeen');
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};