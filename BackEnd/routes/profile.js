const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileCtrl = require('../controllers/profile');
const multer = require('../middleware/multer');

router.get('/profile', auth, profileCtrl.profil);
router.delete('/delete', auth, profileCtrl.delete);
router.put('/modify', auth, multer, profileCtrl.modify);

module.exports = router;