const express = require('express');
const { getChats, createChat } = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getChats);
router.post('/', auth, createChat);

module.exports = router;