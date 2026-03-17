const express = require('express');
const { getUsers, getUser, updateUser } = require('../controllers/userController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getUsers);
router.get('/:id', auth, getUser);
router.put('/profile', auth, updateUser);

module.exports = router;