const Call = require('../models/Call');

exports.createCall = async (req, res) => {
  try {
    const { receiverId, type, duration } = req.body;
    const call = new Call({
      callerId: req.user.id,
      receiverId,
      type,
      duration,
    });
    await call.save();
    await call.populate('callerId receiverId', 'name profilePic');
    res.status(201).json(call);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCalls = async (req, res) => {
  try {
    const calls = await Call.find({
      $or: [{ callerId: req.user.id }, { receiverId: req.user.id }],
    })
      .populate('callerId receiverId', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(calls);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};