/**
 * @authors     Dániel Májer
 * @file        This files defines connections to MySql DB
 *              and serves as a controller for the incoming requests.
 */

"use strict";

// Import and initialize needed instances.
//-----------------------------
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const requestFunctions = require("./request-functions");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "./public")));

global.ACCESS_TOKEN_SECRET = "hellohello";
global.REFRESH_TOKEN_SECRET = "hellohello2";
global.REFRESH_TOKENS = [];

// Create a connection to the databse.
// You can create your user in the next comment below called "USERS".
//-------------------------------------------------------------------
const connection = mysql.createConnection({
  socketPath: "/var/run/mysqld/mysqld.sock",
  host: "localhost",
  database: "SeqMine",

  // USERS:
  // ======
  user: "seqmine",
  password: "seqmine",
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

/* Authenticates and assures that the incoming request
 * is from a user with "investigator" level role.
 * @param req request
 * @param res response
 * @param next
 * @return void
 * */
const authenticateInvestigator = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      if (!user.role || user.role !== "investigator") {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

/* Authenticates and assures that the incoming request
 * is from a user with "admin" level role.
 * @param req request
 * @param res response
 * @param next
 * @return void
 * */
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      if (!user.role || user.role !== "admin") {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Initialize route endpoint listeners.
// They are defined in the ./request-funtions.js file.

// FILES
// ============================================
requestFunctions.handleFileUpload(app);
requestFunctions.handleDownloadSequenceFile(app, connection);
requestFunctions.handlePostDeleteFileByID(app, authenticateAdmin, connection);
requestFunctions.handleGetSequenceFiles(app, connection);
requestFunctions.handlePostUpdateSeqFile(
  app,
  authenticateInvestigator,
  connection
);
requestFunctions.handleRegisterFileUpload(app, connection);
requestFunctions.handlePostSeqFileByID(app, connection);
// ============================================

// USERS
// ============================================
requestFunctions.handleGetRoles(app, authenticateAdmin, connection);
requestFunctions.handleGetLastUserID(app, authenticateAdmin, connection);
requestFunctions.handleGetUsers(app, authenticateAdmin, connection);
requestFunctions.handlePostAddUser(app, authenticateAdmin, connection);
requestFunctions.handlePostUserByID(app, authenticateAdmin, connection);
requestFunctions.handlePostDeleteUserByID(app, authenticateAdmin, connection);
requestFunctions.handlePostUpdateUser(app, authenticateAdmin, connection);
requestFunctions.handlePostRegisterUser(app, connection);
// ============================================

// SESSIONS
// ============================================
requestFunctions.handlePostLogin(app, connection);
requestFunctions.handlePostLogOut(app);
requestFunctions.handlePostRefreshSession(app, connection);
requestFunctions.handlePostSessionValidation(app);
// ============================================

// Initialize the app.
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
