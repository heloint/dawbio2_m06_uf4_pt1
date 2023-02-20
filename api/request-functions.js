const multer = require("multer");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

/**
 * Function to configure the storage for the uploaded files
 * @return {Object} - Multer configuration.
 */
const configureStorage = () => {
  return multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "uploads/");
    },
    filename: function (req, file, callback) {
      // If file exists, we don't upload.
      if (!fs.existsSync(path.join("uploads/", file.originalname))) {
        callback(null, file.originalname);
      } else {
        callback(new Error("File already exists!"), file.originalname);
      }
      // callback(null, file.originalname);
    },
  });
};

/**
 * Function to handle the registration of the uploaded file in the database.
 * @param {Object} app - Express application
 * @param {Object} connection - Connector instance to MySQL.
 */
const handleRegisterFileUpload = (app, connection) => {
  app.post("/registerSequence", (req, res) => {
    connection.query(
      ` INSERT INTO sequence_files VALUES
            (
                NEXT VALUE FOR sequence_file_id,
                ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), ?
            ) `,
      [
        req.body.name,
        req.body.description,
        req.body.size,
        `${__dirname}/uploads/${req.body.name}`,
        req.body.gene,
        req.body.taxonomyID,
        req.body.uploadedBy,
      ],
      function (error, result, field) {
        if (error) {
          console.log(error);
          res.status(400).send({ error: "File already exists!" });
        } else {
          res.status(200).send({ result: true });
        }
      }
    );
  });
};

/**
 * Function to handle the file upload
 * @param {Object} app - Express application
 */
const handleFileUpload = (app) => {
  const storage = configureStorage();
  const upload = multer({ storage: storage });

  app.post(
    "/uploadSequence",
    upload.array("file"),
    (req, res) => {
      const file = req;

      // If no file received, then exception sent back.
      if (!file) {
        const error = new Error("Please upload a file");
        res.status(400).send({ error: error.message });
      }
    },
    (err, req, res, next) => {
      res.status(400).json({ error: err.message });
    }
  );
};

/**
 * Function to handle the file upload
 * @param {Object} app - Express application
 * @param {Object} connection - Connector instance to MySQL.
 */
const handleDownloadSequenceFile = (app, connection) => {
  app.get(
    "/downloadSequenceFile",
    (req, res) => {
      const fileID = req.query.id;

      // If no file received, then exception sent back.
      if (!fileID) {
        const error = new Error("No file were requested for download.");
        res.status(400).send({ error: error.message });
      } else {
        connection.query(
          `SELECT path FROM sequence_files WHERE file_id=?`,
          [fileID],
          function (error, result, field) {
            if (error) {
              console.log(error);
              res.status(400).send({ result: false });
            } else {
              const path = result[0].path;
              // res.status(200).send({ result: true });
              res.download(path);
            }
          }
        );
      }
    },
    (err, req, res, next) => {
      console.log(err.message);
      res.status(400).json({ error: err.message });
    }
  );
};

/**
 * Function to handle post request to delete the
 * user with the corresponding ID.
 * @param {Object} app - Express application
 * @param {Object} authenticatejwt - Token authentication with JWT.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostDeleteFileByID = (app, authenticatejwt, connection) => {
  app.post("/deleteFileByID", authenticatejwt, function (req, res) {
    connection.query(
      `SELECT path FROM sequence_files WHERE file_id=?`,
      [req.body.id],
      function (error, result, field) {
        if (error) {
          console.log(error);
          res.status(400).send({ error: error.message });
        } else {
          const path = result[0].path;
          fs.unlinkSync(path);

          connection.query(
            `DELETE FROM sequence_files WHERE file_id=?`,
            [req.body.id],
            function (error, result, field) {
              if (error) {
                console.log(error);
                res.status(400).send({ results: false });
              } else {
                console.log("Succesfully deleted file.");
                res.status(200).send({ result: true });
              }
            }
          );
        }
      }
    );
  });
};

/**
 * Function to handle getting all sequence files.
 * @param {Object} app - Express application
 * @param {Object} connection - Connector instance to MySQL.
 */
const handleGetSequenceFiles = (app, connection) => {
  app.get("/sequenceFiles", function (req, res) {
    connection.query(
      `SELECT * FROM sequence_files`,
      function (error, results, field) {
        if (error) {
          console.log(error);
          res.status(400).send({ results: null });
        } else {
          res.status(200).send({ result: results });
        }
      }
    );
  });
};

/**
 * Function to handle post request to update the
 * user with the received datas.
 * @param {Object} app - Express application
 * @param {Object} authenticatejwt - Token authentication with JWT.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostUpdateSeqFile = (app, authenticatejwt, connection) => {
  app.post("/updateSequenceFile", authenticatejwt, function (req, res) {
    connection.query(
      `
            UPDATE sequence_files
            SET
                name=?,
                description=?,
                taxonomy_id=?,
                gene=?
            WHERE
                file_id=?
        `,
      [
        req.body.name,
        req.body.description,
        req.body.taxonomy_id,
        req.body.gene,
        req.body.file_id,
      ],
      function (error, result, field) {
        if (error) {
          console.log(error);
          res.status(400).send({ results: false });
        } else {
          res.status(200).send({ result: true });
        }
      }
    );
  });
};

/**
 * Function to handle getting data about user by it's ID.
 * @param {Object} app - Express application
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostSeqFileByID = (app, connection) => {
  app.post("/fileByID", function (req, res) {
    connection.query(
      ` SELECT * FROM sequence_files WHERE file_id = ?`,
      [req.body.fileID],
      function (error, result, field) {
        if (error) {
          console.log(error);
          res.status(400).send({ results: false });
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
};


/**
 * Function to handle getting all roles.
 * @param {Object} app - Express application
 * @param {Object} authenticatejwt - Token authentication with JWT.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handleGetRoles = (app, authenticatejwt, connection) => {
  app.get("/roles", authenticatejwt, function (req, res) {
    connection.query(`SELECT * FROM roles`, function (error, results, field) {
      if (error) {
        console.log(error);
        res.status(400).send({ results: null });
      } else {
        res.status(200).send({ result: results });
      }
    });
  });
};

/**
 * Function to handle getting the last occupied user ID.
 * @param {Object} app - Express application
 * @param {Object} authenticatejwt - Token authentication with JWT.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handleGetLastUserID = (app, authenticatejwt, connection) => {
  app.get("/lastUserID", authenticatejwt, function (req, res) {
    connection.query(
      `SELECT MAX(user_id) AS last_id FROM users`,
      function (error, results, field) {
        if (error) {
          console.log(error);
          res.status(400).send({ results: null });
        } else {
          res.status(200).send({ result: results[0].last_id });
        }
      }
    );
  });
};

/**
 * Function to handle getting all users from database.
 * @param {Object} app - Express application
 * @param {Object} authenticatejwt - Token authentication with JWT.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handleGetUsers = (app, authenticatejwt, connection) => {
  app.get("/users", authenticatejwt, function (req, res) {
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
          console.log(error);
          res.status(400).send({ results: null });
        } else {
          res.status(200).send({ result: results });
        }
      }
    );
  });
};

/**
 * Function to handle the session login and registration of the received user.
 * @param {Object} app - Express application
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostLogin = (app, connection) => {
  app.post("/login", function (req, res) {
    connection.query(
      `SELECT U.user_id, U.username, U.first_name, U.last_name, R.role_name FROM users AS U JOIN roles as R ON U.role_id=R.role_id WHERE username=? AND password=?`,
      [req.body.username, req.body.password],
      function (error, result, field) {
        if (error) {
          console.log(error);
          res.status(400).send({ results: false });
        } else {
          // If result is not zero, then register the session token.
          if (result.length > 0) {
            const accessToken = jwt.sign(
              {
                username: result[0].username,
                first_name: result[0].first_name,
                last_name: result[0].last_name,
                role: result[0].role_name,
              },
              ACCESS_TOKEN_SECRET,
              { expiresIn: "120m" }
            );

            const refreshToken = jwt.sign(
              {
                username: result[0].username,
                first_name: result[0].first_name,
                last_name: result[0].last_name,
                role: result[0].role_name,
              },
              REFRESH_TOKEN_SECRET
            );

            REFRESH_TOKENS.push(refreshToken);
            // res.json({token: accessToken});

            res.status(200).send({
              username: result[0].username,
              first_name: result[0].first_name,
              last_name: result[0].last_name,
              role: result[0].role_name,
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
          } else {
            res.status(200).send({});
          }
        }
      }
    );
  });
};

/**
 * Function to handle the session login and registration of the received user.
 * @param {Object} app - Express application
 */
const handlePostSessionValidation = (app) => {
  app.post("/sessionValidation", function (req, res) {
    const token = req.body.token;
    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      // const user = jwt.verify(token, ACCESS_TOKEN_SECRET);

      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      const accessToken = jwt.sign(
        {
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "120m" }
      );

      const refreshToken = jwt.sign(
        {
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
        REFRESH_TOKEN_SECRET
      );

      res.status(200).send({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    });
  });
};

/*
 * Handles the POST request for refreshing a user's session using a refresh token.
 * @param {Object} app - Express application instance
*/
const handlePostRefreshSession = (app) => {
  app.post("/refreshSession", (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(401);
    }
    if (!REFRESH_TOKENS.includes(refreshToken)) {
      return res.sendStatus(403);
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }


      const accessToken = jwt.sign(
        {
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
      );

      res.status(200).send({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    });
  });
};

/**
 * Function to handle the logout process by destroying
 * the corresponding register in the database.
 * @param {Object} app - Express application
 */
const handlePostLogOut = (app) => {
  app.post("/logout", function (req, res) {
    const token = req.body.refreshToken;
    console.log("deleting refresh token");

    if (!token) {
      return res.sendStatus(401);
    }
    const index = REFRESH_TOKENS.indexOf(token);

    if (index > -1) {
      array.splice(index, 1);
    }
    return res.sendStatus(200);
  });
};

/**
 * Function to handle adding new user to the database.
 * @param {Object} app - Express application
 * @param {Object} authenticatejwt - Token authentication with JWT.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostAddUser = (app, authenticatejwt, connection) => {
  app.post("/addUser", authenticatejwt, function (req, res) {
    connection.query(
      ` INSERT INTO users VALUES
            (NEXT VALUE FOR user_id,
                ?,
                ( SELECT role_id
                  FROM roles
                  WHERE role_name=?
                ),
                ?, ?, ?, ?, CURRENT_TIMESTAMP()
            ) `,
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
          let errorMsg = "Internal error has occured.";
          if (error.code === "ER_DUP_ENTRY") {
            errorMsg = "User already exists!";
          }
          res.status(400).send({ results: false, errorMsg: errorMsg });
        } else {
          res.status(200).send({ result: true });
        }
      }
    );
  });
};

/**
 * Function to handle registration of a new user in the database.
 * @param {Object} app - Express application
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostRegisterUser = (app, connection) => {
  app.post("/registerUser", function (req, res) {
    connection.query(
      ` INSERT INTO users VALUES
            (NEXT VALUE FOR user_id,
                ?,
                ( SELECT role_id
                  FROM roles
                  WHERE role_name=?
                ),
                ?, ?, ?, ?, CURRENT_TIMESTAMP()
            ) `,
      [
        req.body.username,
        "investigator",
        req.body.password,
        req.body.email,
        req.body.first_name,
        req.body.last_name,
      ],
      function (error, result, field) {
        if (error) {
          console.log(error.code);
          let errorMsg = "Internal error has occured.";
          if (error.code === "ER_DUP_ENTRY") {
            errorMsg = "User already exists!";
          }
          res.status(400).send({ results: false, errorMsg: errorMsg });
        } else {
          res.status(200).send({ result: true });
        }
      }
    );
  });
};

/**
 * Function to handle getting data about user by it's ID.
 * @param {Object} app - Express application
 * @param {Object} authenticatejwt - Token authentication with JWT.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostUserByID = (app, authenticatejwt, connection) => {
  app.post("/userByID", authenticatejwt, function (req, res) {
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
      [req.body.userID],
      function (error, result, field) {
        if (error) {
          console.log(error);
          res.status(400).send({ results: false });
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
};

/**
 * Function to handle post request to delete the
 * user with the corresponding ID.
 * @param {Object} app - Express application
 * @param {Object} authenticatejwt - Token authentication with JWT.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostDeleteUserByID = (app, authenticatejwt, connection) => {
  app.post("/deleteUserByID", authenticatejwt, function (req, res) {
    connection.query(
      `DELETE FROM users WHERE user_id=?`,
      [req.body.userID],
      function (error, result, field) {
        if (error) {
          console.log(error);
          res.status(400).send({ results: false });
        } else {
          res.status(200).send({ result: true });
        }
      }
    );
  });
};

/**
 * Function to handle post request to update the
 * user with the received datas.
 * @param {Object} app - Express application
 * @param {Object} authenticatejwt - Token authentication with JWT.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostUpdateUser = (app, authenticatejwt, connection) => {
  app.post("/updateUser", authenticatejwt, function (req, res) {
    connection.query(
      `
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
        `,
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
          console.log(error);
          res.status(400).send({ results: false });
        } else {
          res.status(200).send({ result: true });
        }
      }
    );
  });
};

// Export functions.
module.exports = {
  // USERS
  handleGetRoles: handleGetRoles,
  handleGetLastUserID: handleGetLastUserID,
  handleGetUsers: handleGetUsers,
  handlePostAddUser: handlePostAddUser,
  handlePostUserByID: handlePostUserByID,
  handlePostDeleteUserByID: handlePostDeleteUserByID,
  handlePostUpdateUser: handlePostUpdateUser,
  handlePostRegisterUser: handlePostRegisterUser,

  // FILES
  handleDownloadSequenceFile: handleDownloadSequenceFile,
  handlePostDeleteFileByID: handlePostDeleteFileByID,
  handleFileUpload: handleFileUpload,
  handleRegisterFileUpload: handleRegisterFileUpload,
  handleGetSequenceFiles: handleGetSequenceFiles,
  handlePostSeqFileByID: handlePostSeqFileByID,
  handlePostUpdateSeqFile: handlePostUpdateSeqFile,

  // SESSIONS
  handlePostLogin: handlePostLogin,
  handlePostSessionValidation: handlePostSessionValidation,
  handlePostRefreshSession: handlePostRefreshSession,
  handlePostLogOut: handlePostLogOut,
};
