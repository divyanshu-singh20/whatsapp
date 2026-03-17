const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  media: {
    type: String, // URL to image or text content
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image'],
    default: 'text',
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  },
}, {
  timestamps: true,
});

// Auto-delete expired statuses
statusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Status', statusSchema);