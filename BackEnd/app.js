const express = require('express');
const mysql = require('mysql');
const helmet = require('helmet');
//const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
//const path = require('path');
const dotenv = require("dotenv");
const userRoutes = require('./routes/user');

const app = express();

dotenv.config({ path: './.env' });


/*const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});*/

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());

app.use(helmet());

app.use("/api/auth", userRoutes);

//app.use(limiter);

module.exports = app;