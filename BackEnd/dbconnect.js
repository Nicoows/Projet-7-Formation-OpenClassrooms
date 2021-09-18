const mysql = require('mysql');
const env = require('./.env');

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306', 
    user: 'root', 
    password: 'Groupomania1',
    database: 'groupomania'
  });

  db.connect(function(err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL!");
  });

module.exports = db;