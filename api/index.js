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
// const path       = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// app.use('/', express.static(path.join(__dirname, 'test')))

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

/**
 * Get all users data
 *
 * @description         Recieve a request by GET method.
 *                      Query the request to the database.
 *                      Return a response to http://localhost:3000/userData. If error
 *                      ocurred the response will be null, else return all users data.
 *
 * @param  {string}     '/users' as path where to sent the data.
 * @return {Response}   to http://localhost:3000/userData
 *
 */
app.get("/users", cors(), function (req, res) {
    console.log("Trying to get data from the database.");

    connection.query(
        `SELECT
            user_id,
            username,
            role,
            password,
            first_name,
            last_name,
            registration_date
         FROM users
        `,

        function (error, results, field) {
            if (error) {
                console.log(
                    "Error occured during the query of the bank accounts."
                );
                console.log("============================");
                console.log(error);
                console.log("============================");
                res.status(400).send({ results: null });
            } else {
                res.status(200).send({ result: results });
            }
        }
    );
});
// ----------------------------------------------------------------

// ----------------------------------------------------------------

/**
 * Summary:
 * ------------
 * Modify de database.
 *
 * @description         Recieve a request by POST method.
 *                      Make a Query to update the database.
 *                      Return a response to http://localhost:3000/postClientData. If error
 *                      ocurred the response will be an error message, else will be a success
 *                      message.
 *
 * @param  {string}     '/postClientData' as path where to sent the data.
 * @return {Response}   to http://localhost:3000/postClientData
 */
app.post("/login", cors(), function (req, res) {
    console.log("Trying to send data from the database.");

    let sql = `SELECT * FROM users WHERE username=? AND password=?`;

    connection.query(
        sql,
        [
            req.body.username,
            req.body.password,
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

                console.log("Succesfully retrieved data.");
                if (result.length > 0) {
                    res.status(200).send({
                        username: result[0].username,
                        first_name: result[0].first_name,
                        last_name: result[0].last_name,
                        role: result[0].role,
                    });
                } else {
                    res.status(200).send({});
                }
            }
        }
    );

});
// ----------------------------------------------------------------

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
