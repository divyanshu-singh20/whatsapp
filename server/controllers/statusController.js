const Status = require('../models/Status');

exports.createStatus = async (req, res) => {
  try {
    const { media, type } = req.body;
    const status = new Status({
      userId: req.user.id,
      media,
      type,
    });
    await status.save();
    res.status(201).json(status);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStatuses = async (req, res) => {
  try {
    const statuses = await Status.find({
      expiresAt: { $gt: new Date() },
    })
      .populate('userId', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};