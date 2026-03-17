const Message = require('../models/Message');
const Chat = require('../models/Chat');

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate('senderId', 'name profilePic')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const message = new Message({
      senderId: req.user.id,
      chatId: req.params.chatId,
      text,
    });

    await message.save();
    await message.populate('senderId', 'name profilePic');

    // Update chat's lastMessage
    await Chat.findByIdAndUpdate(req.params.chatId, {
      lastMessage: message._id,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAsSeen = async (req, res) => {
  try {
    await Message.updateMany(
      { chatId: req.params.chatId, senderId: { $ne: req.user.id } },
      { seen: true }
    );
    res.json({ message: 'Messages marked as seen' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};