const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer');

router.post('/post', auth, multer, postCtrl.createPost);
router.get('/get', auth, postCtrl.getAllPost);
router.delete('/delete/:postId', auth, postCtrl.deletePost);
router.post('/comment/:postId', auth, postCtrl.createComments);
router.get('/get/comment/:postId', auth, postCtrl.getAllCom);
router.get('/get/number/com/:postId', auth, postCtrl.getNumberCom);
router.put('/dislike/:postId', auth, postCtrl.dislike);
router.get('/get/number/like/:postId', auth, postCtrl.getNumberLike);
router.get('/get/userId', auth, postCtrl.getUserId);
router.delete('/delete/com/:commentId', auth, postCtrl.deleteCom);

module.exports = router;