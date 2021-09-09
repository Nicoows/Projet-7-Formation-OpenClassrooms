const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('../dbconnect');
const env = require("../.env");
const fs = require("fs");

exports.profil = (req, res, next) => {
    const userId = res.locals.userId;

    let sqlGetUser;

    sqlGetUser = `SELECT email, name, password, avatar, description FROM users WHERE userId = ?`;
    mysql.query(sqlGetUser, [userId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(200).json(result);
    });
}

exports.delete = (req, res, next) => {
    const userId = res.locals.userId;

    let sqlDeleteUser;
    let sqlFindUser;

    sqlFindUser = "SELECT avatar FROM users WHERE userId = ?";

    mysql.query(sqlFindUser, [userId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        const filename = result[0].avatar.split('/image/')[1];
        if(filename !== "avatarDefault.png"){
            fs.unlink(`image/${filename}`, (e) => {
                if(e){
                    console.log("Image pas supprimé");
                }
            })
        }
        sqlDeleteUser = 'DELETE FROM users WHERE userId = ?';
        mysql.query(sqlDeleteUser, [userId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(200).json({message : "Utilisateur supprimé !"});
    })
    })
}

exports.modify = (req, res, next) => {
    const userId = res.locals.userId;
    const description = req.body.description;
    const name = req.body.name;
    const email = req.body.email;

    let sqlAddDescription;
    let sqlFindUser;

    if (req.file){
        const avatarUrl = `${req.protocol}://${req.get("host")}/image/${req.file.filename}`;

        sqlFindUser = "SELECT avatar FROM users WHERE userId = ?";
        
        mysql.query(sqlFindUser, [userId], function(err, result){
            if (err) {
                return res.status(500).json(err.message);
            } 
            const filename = result[0].avatar.split('/image/')[1];
            if(filename !== "avatarDefault.png") {
                fs.unlink(`image/${filename}`, () => {
                mysql.query("UPDATE users SET avatar=? WHERE userId = ?", [avatarUrl, userId], function(err, result){
                    if (err) {
                        return res.status(500).json(err.message);
                    }else{
                        console.log("Image modifié");
                    }
                })
            })
            } else {
                mysql.query("UPDATE users SET avatar=? WHERE userId = ?", [avatarUrl, userId], function(err, result){
                    if (err) {
                        return res.status(500).json(err.message);
                    }else{
                        console.log("Image modifié");
                    }
                })
            }
        })
    }

    let sqlTakePassword;

    sqlTakePassword = "SELECT password FROM users WHERE userId = ?";

    mysql.query(sqlTakePassword, [userId], function(err, result){
        if (err) {
            return res.status(500).json(err.message);
        }

        const passwordHashed = result[0].password;
        const password = req.body.password;
        const newPassword = req.body.newPassword;

        if(req.body.password && req.body.newPassword){
            bcrypt.compare(password, passwordHashed)
                .then(valid =>{
                    if (!valid) {
                        return res.status(402).json({ error: "Mot de passe incorrect !" });
                    }
                    if(newPassword){
                        bcrypt.hash(newPassword, 10)
                            .then(hash =>{
                                sqlChangePassword = "UPDATE users SET description=?, name=?, email=?, password=? WHERE userId = ?"
                                mysql.query(sqlChangePassword, [description, name, email, hash, userId], function(err, result){
                                    if (err) {
                                        return res.status(500).json(err.message);
                                    }
                                    res.status(200).json({ message: "Changement réussi !" });
                                })
                            })
                    } else {
                        sqlAddDescription = 'UPDATE users SET description=?, name=?, email=? WHERE userId = ?';

                        mysql.query(sqlAddDescription, [description, name, email, userId], function(err, result){
                            if (err) {
                                return res.status(500).json(err.message);
                            }
                            res.status(200).json({message : "Profil modifié !"});
                        })
                    }
                })
                .catch(e => res.status(500).json(e));
        }
    })

}