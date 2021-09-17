const express = require('express');
const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/verifyPassword');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/get/userId', auth, userCtrl.getUserId);


module.exports = router;