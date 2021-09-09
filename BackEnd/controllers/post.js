const jwt = require('jsonwebtoken');
const mysql = require('../dbconnect');
const env = require("../.env");

exports.createPost = (req, res, next) => {
    const userId = res.locals.userId;
    
    const message = req.body.message;

    let sqlCreatePost;

    sqlCreatePost = "INSERT INTO post (message, user_Id, datePost) VALUES (?, ?, NOW())";

    mysql.query(sqlCreatePost, [message, userId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(200).json({message : "Post envoyé"});
    })
}

exports.getAllPost = (req, res, next) => {
    let sqlGetAll;

    sqlGetAll = "SELECT postId, message, name, avatar, datePost FROM post LEFT JOIN users ON post.user_Id = users.userId";

    mysql.query(sqlGetAll, function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(200).json(result);
    })
}

exports.deletePost = (req, res, next) => {
    const userId = res.locals.userId;
    const postId = req.params.postId;
    
    let sqlDeletePost; 

    sqlDeletePost = 'DELETE FROM post WHERE user_Id = ? AND postId = ?';

    mysql.query(sqlDeletePost, [userId, postId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(200).json({message : "Post supprimé"});
    })
}

exports.createComments = (req, res, next) => {
    const userId = res.locals.userId;
    const postId = req.params.postId;
    const comment = req.body.comment;

    let sqlCreateComment;

    sqlCreateComment = "INSERT INTO comments (comment, comUserId, post_Id) VALUES (?, ?, ?)";

    mysql.query(sqlCreateComment, [comment, userId, postId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(200).json({message : "Commentaires envoyé"});
    })
}

exports.getAllCom = (req, res, next) => {
    const postId = req.params.postId;

    let sqlGetAllCom;

    sqlGetAllCom = "SELECT comment, name, avatar FROM comments LEFT JOIN users ON comments.comUserId = users.userId WHERE post_Id=?";

    mysql.query(sqlGetAllCom, [postId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(200).json(result);
    })
}

exports.getNumberCom = (req, res, next) => {
    const postId = req.params.postId;

    let sqlGetNumberCom;

    sqlGetNumberCom = "SELECT count(*), post_Id FROM comments";

    mysql.query(sqlGetNumberCom, [postId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(200).json(result);
    })
}