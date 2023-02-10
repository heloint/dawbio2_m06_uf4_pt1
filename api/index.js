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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', express.static(path.join(__dirname, './public')))

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

requestFunctions.handleFileUpload(app, cors);
requestFunctions.handleGetRoles(app, cors, connection);
requestFunctions.handleGetLastUserID(app, cors, connection);
requestFunctions.handleGetUsers(app, cors, connection);
requestFunctions.handlePostLogin(app, cors, connection);
requestFunctions.handlePostAddUser(app, cors, connection);
requestFunctions.handlePostUserByID(app, cors, connection);

app.post("/userByID", cors(), function (req, res) {
    connection.query(
        ` SELECT
            U.user_id,
            U.username,
            R.role_name,
            U.password,
            U.email,
            U.first_name,
            U.last_name,
            U.registration_date
         FROM users AS U JOIN roles as R ON U.role_id=R.role_id
         WHERE U.user_id = ?`,
        [
            req.body.userID,
        ],
        function (error, result, field) {
            if (error) {
                console.log(error);
                res.status(400).send({ results: false});
            } else {
                if (result.length > 0) {
                    res.status(200).send({ result: result });
                } else {
                    res.status(200).send({});
                }
            }
        }
    );
});

app.post("/deleteUserByID", cors(), function (req, res) {
    console.log("Trying to send data from the database.");

    let sql = `DELETE FROM users WHERE user_id=? `;


    connection.query(
        sql,
        [
            req.body.userID,
        ],
        function (error, result, field) {
            if (error) {
                console.log(
                    "The following error has occured during querying the database:"
                );
                console.log("===================================");
                console.log(error);
                console.log("===================================");
                res.status(400).send({ results: false});
            } else {
              console.log("Succesfully deleted user.");
              res.status(200).send({ result: true});
            }
        }
    );

});

app.post("/updateUser", cors(), function (req, res) {
    console.log("Trying to send data from the database.");

    let sql = `
        UPDATE users
        SET
            username=?,
            role_id=(
                SELECT role_id
                FROM roles
                WHERE role_name=?
            ),
            password=?,
            email=?,
            first_name=?,
            last_name=?
        WHERE
            user_id=?
    `;

    connection.query(
        sql,
        [
            req.body.username,
            req.body.role_name,
            req.body.password,
            req.body.email,
            req.body.first_name,
            req.body.last_name,
            req.body.user_id,
        ],
        function (error, result, field) {
            if (error) {
                console.log(
                    "The following error has occured during querying the database:"
                );
                console.log("===================================");
                console.log(error);
                console.log("===================================");
                res.status(400).send({ results: false});
            } else {
              console.log("Succesfully deleted user.");
              res.status(200).send({ result: true});
            }
        }
    );

});


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
