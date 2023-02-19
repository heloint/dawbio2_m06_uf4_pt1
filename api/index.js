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
    /* user: "dama",
    password: "Stabilo1", */
    user: "danielmajer",
    password: "Fdfac416+",

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

requestFunctions.handleFileUpload(app, connection);
requestFunctions.handleGetRoles(app, connection);
requestFunctions.handleGetLastUserID(app, connection);
requestFunctions.handleGetUsers(app, authenticateJWT, connection);
requestFunctions.handlePostLogin(app, connection);
requestFunctions.handlePostAddUser(app, connection);
requestFunctions.handlePostUserByID(app, connection);
requestFunctions.handlePostDeleteUserByID(app, connection);
requestFunctions.handlePostUpdateUser(app, connection);
requestFunctions.handleRegisterFileUpload(app, connection);
requestFunctions.handlePostSessionValidation(app, connection);
requestFunctions.handlePostRefreshSession(app, connection);
requestFunctions.handlePostLogOut(app, connection);
requestFunctions.handleGetSequenceFiles(app, connection);
requestFunctions.handleDownloadSequenceFile(app, connection);
requestFunctions.handlePostDeleteFileByID(app, connection);
requestFunctions.handlePostRegisterUser(app, connection);
requestFunctions.handlePostSeqFileByID(app, connection);
requestFunctions.handlePostUpdateSeqFile(app, connection);

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
