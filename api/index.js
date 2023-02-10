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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', express.static(path.join(__dirname, './public')))


// MULTER FILE UPLOAD
// ===========================================
const multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({storage: storage });

app.post('/uploadFasta', cors(), upload.array("file"), (req, res) => {

  const file = req;
    console.log(req.body);
    console.log(req.files);

  /* if (!file) {

    const error = new Error('Please upload a file')

    error.httpStatusCode = 400

    return next(error)

  }

    res.send(file) */
})
// ===========================================

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

app.get("/roles", cors(), function (req, res) {
    console.log("Trying to get data from the database.");

    connection.query(
        `SELECT * FROM roles`,

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

app.get("/lastUserID", cors(), function (req, res) {
    console.log("Trying to get data from the database.");

    connection.query(
        `SELECT MAX(user_id) AS last_id FROM users`,

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
                res.status(200).send({ result: results[0].last_id });
            }
        }
    );
});

app.get("/users", cors(), function (req, res) {
    console.log("Trying to get data from the database.");

    connection.query(
        `SELECT
            U.user_id,
            U.username,
            R.role_name,
            U.password,
            U.email,
            U.first_name,
            U.last_name,
            U.registration_date
         FROM users AS U JOIN roles as R ON U.role_id=R.role_id
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

app.post("/userByID", cors(), function (req, res) {
    console.log("Trying to send data from the database.");

    let sql = `
        SELECT
            U.user_id,
            U.username,
            R.role_name,
            U.password,
            U.email,
            U.first_name,
            U.last_name,
            U.registration_date
         FROM users AS U JOIN roles as R ON U.role_id=R.role_id
         WHERE U.user_id = ?
    `;


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

                console.log("Succesfully retrieved data.");
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

app.post("/addUser", cors(), function (req, res) {
    console.log("Trying to send data from the database.");

    let sql = `
        INSERT INTO users VALUES 
        (NEXT VALUE FOR user_id, 
            ?,
            ( SELECT role_id
              FROM roles
              WHERE role_name=?
            ),
            ?,
            ?,
            ?,
            ?,
            now()
        )
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
              console.log("Succesfully added user.");
              res.status(200).send({ result: true});
            }
        }
    );

});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
