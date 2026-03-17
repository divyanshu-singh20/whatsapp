const express = require('express');
const { getMessages, sendMessage, markAsSeen } = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/:chatId', auth, getMessages);
router.post('/:chatId', auth, sendMessage);
router.put('/:chatId/seen', auth, markAsSeen);

module.exports = router;