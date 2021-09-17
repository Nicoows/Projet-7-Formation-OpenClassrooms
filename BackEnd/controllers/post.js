const jwt = require('jsonwebtoken');
const mysql = require('../dbconnect');
const env = require("../.env");
const fs = require("fs");

exports.createPost = (req, res, next) => {
    const userId = res.locals.userId;
    
    const message = req.body.message;

    let sqlCreatePost;
    let sqlCreateImage;

    if(req.file){
        const imageUrl = `${req.protocol}://${req.get("host")}/image/${req.file.filename}`;

        sqlCreateImage = "INSERT INTO post (message, image, user_Id, datePost) VALUES (?, ?, ?, NOW())";

        mysql.query(sqlCreateImage, [message, imageUrl, userId], function(err, result){
            if (err) {
                return res.status(500).json(err.message);
            }
            res.status(200).json({message : "Post et image envoyé"});
        })
        console.log(imageUrl);
    } else {

    sqlCreatePost = "INSERT INTO post (message, user_Id, datePost) VALUES (?, ?, NOW())";

    mysql.query(sqlCreatePost, [message, userId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(200).json({message : "Post envoyé"});
    })
    }
}

exports.getAllPost = (req, res, next) => {
    let sqlGetAll;

    sqlGetAll = "SELECT *, DATE_FORMAT(post.datePost, '%d-%m-%Y') AS 'datePost' FROM post "
    + " LEFT JOIN users ON post.user_Id = users.userId";
    

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
    let sqlFindUser;

    sqlFindUser = "SELECT image FROM post WHERE user_Id = ? AND postId = ?";

    mysql.query(sqlFindUser, [userId, postId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        const filename = result[0].image.split('/image/')[1];
        fs.unlink(`image/${filename}`, (e) => {
            if(e){
                console.log("Image pas supprimé");
            }
        })
        sqlDeletePost = 'DELETE FROM post WHERE user_Id = ? AND postId = ?';

        mysql.query(sqlDeletePost, [userId, postId], function(err, result){
            if (err) {
                return res.status(500).json(err.message);
            }
            res.status(200).json({message : "Post supprimé"});
        })
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

    sqlGetAllCom = "SELECT comment, name, avatar, commentId, comUserId, post_Id FROM comments LEFT JOIN users ON comments.comUserId = users.userId WHERE post_Id = ?";

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

    sqlGetNumberCom = "SELECT count(*) AS 'comNum', post_Id AS 'postId' FROM comments GROUP BY post_Id";

    mysql.query(sqlGetNumberCom, [postId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(200).json(result);
    })
}

exports.deleteCom = (req, res, next) => {
    const userId = res.locals.userId;
    const comId = req.params.commentId;

    let sqlDeleteCom;
    
    sqlDeleteCom = "DELETE FROM comments WHERE comUserId = ? AND commentId = ?";

    mysql.query(sqlDeleteCom, [userId, comId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(200).json({message : "Commentaire supprimé"});
    })
}

exports.dislike = (req, res, next) => {
    const userId = res.locals.userId;
    const postId = req.params.postId;

    let sqlFindUser;

    sqlFindUser = "SELECT likeUserId FROM likes WHERE post_Id=? AND likeUserId = ?";

    mysql.query(sqlFindUser, [postId, userId], function(err, result){
        if(result.length > 0){
            let sqlDislike;

            sqlDislike = "DELETE FROM likes WHERE likeUserId = ? AND post_Id = ?";

            mysql.query(sqlDislike,[userId, postId], function(err, result){
                if (err) {
                    return res.status(500).json(err.message);
                }
                res.status(200).json({message : "Like supprimé"});
            })
            console.log(result);
            } else {
            let sqlAjoutLike;

            sqlAjoutLike = "INSERT INTO likes (aime, likeUserId, post_Id) VALUES (+1, ?, ?)";

            mysql.query(sqlAjoutLike, [userId, postId], function(err, result){
                if (err) {
                    return res.status(500).json(err.message);
                }
                res.status(200).json({message : "Like ajouté"});
            })
            console.log("erreur");
        }
})
}

exports.getNumberLike = (req, res, next) => {
    const postId = req.params.postId;

    let sqlGetNumberLike;

    sqlGetNumberLike = "SELECT count(*) AS 'likeNum', post_Id AS 'postId' FROM likes GROUP BY post_Id";

    mysql.query(sqlGetNumberLike, [postId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(200).json(result);
    })
}