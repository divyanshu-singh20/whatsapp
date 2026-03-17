const express = require('express');
const { createCall, getCalls } = require('../controllers/callController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createCall);
router.get('/', auth, getCalls);

module.exports = router;