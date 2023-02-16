/**
 * @authors     Dániel Májer
 * @description This file connects to a MySql database and respond to
 *              the requests fromm 'app/js/index.script.js'. The requests
 *              can be:
 *
 * @file        This files defines connections to MySql DB.
 */

"use strict";

// Import and initialize needed instances.
//-----------------------------
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const path = require('path');
const multer = require("multer");
const requestFunctions = require("./request-functions");
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, './public')))


global.ACCESS_TOKEN_SECRET = 'hellohello';
global.REFRESH_TOKEN_SECRET = 'hellohello2';
global.REFRESH_TOKENS = [];

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Create a connection to the databse.
// You can create your user in the next comment below called "USERS".
//-------------------------------------------------------------------
const connection = mysql.createConnection({
    socketPath: "/var/run/mysqld/mysqld.sock",
    host: "localhost",
    database: "SeqMine",

    // USERS:
    // ======
    user: "dama",
    password: "Stabilo1",
    /* user: "danielmajer",
    password: "Fdfac416+", */

});
console.log("Logging into the database...");

// Try to create the connection.
// -----------------------------
connection.connect(function (err) {
    console.log(err);

    if (err) {
        console.error("Error connecting: " + err.stack);
        return;
    }

    console.log("Connected as id " + connection.threadId);
});

requestFunctions.handleFileUpload(app, cors, connection);
requestFunctions.handleGetRoles(app, cors, connection);
requestFunctions.handleGetLastUserID(app, cors, connection);
requestFunctions.handleGetUsers(app, authenticateJWT, connection);
requestFunctions.handlePostLogin(app, connection, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, REFRESH_TOKENS);
requestFunctions.handlePostAddUser(app, cors, connection);
requestFunctions.handlePostUserByID(app, cors, connection);
requestFunctions.handlePostDeleteUserByID(app, cors, connection);
requestFunctions.handlePostUpdateUser(app, cors, connection);
requestFunctions.handleRegisterFileUpload(app, cors, connection);
requestFunctions.handlePostSessionValidation(app, connection);
requestFunctions.handlePostRefreshSession(app, connection);
requestFunctions.handlePostLogOut(app, cors, connection);
requestFunctions.handleGetSequenceFiles(app, cors, connection);
requestFunctions.handleDownloadSequenceFile(app, cors, connection);
requestFunctions.handlePostDeleteFileByID(app, cors, connection);
requestFunctions.handlePostRegisterUser(app, cors, connection);
requestFunctions.handlePostSeqFileByID(app, cors, connection);
requestFunctions.handlePostUpdateSeqFile(app, cors, connection);

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
