const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('../dbconnect');
const env = require("../.env");

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const email = req.body.email;
            const name = req.body.name;
            const password = hash;
           
            let sqlSignup;
            let values;

            mysql.query('SELECT email FROM users WHERE email = ?', [email], (error, result) => {
                if(error){
                    console.log(error);
                }
                if(result.length > 0) {
                    return res.status(500).json({ error: "Adresse email déjà utilisée !" });
                }
                sqlSignup = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
                values = [name, email, password,];
                mysql.query(sqlSignup, values, function (err, result) {
                if (err) {
                    return res.status(500).json(err.message);
                }
                res.status(201).json({ message: "Utilisateur créé !" });
            });
            });
        })
        .catch(e => res.status(500).json(e));
        console.log(req.body);
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let sqlFindUser;

    sqlFindUser = "SELECT userId, password FROM users WHERE email = ?";

    mysql.query(sqlFindUser, [email], function (err, result) {
        if(err){
            return res.status(500).json(err.message);
        }
        if( result == 0){
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        
        bcrypt.compare(password, result[0].password)
        .then(valid => {
            if(!valid){
                return res.status(402).json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
                token: jwt.sign(
                    { userId: result[0].userId },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: "24h" }
                )
            });
        })
        .catch(e => res.status(501).json(e));
    })

}