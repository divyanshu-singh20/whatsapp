const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  callerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['missed', 'received', 'outgoing'],
    default: 'outgoing',
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Call', callSchema);