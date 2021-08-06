const express = require('express');
const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/verifyPassword');
const router = express.Router();

router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;