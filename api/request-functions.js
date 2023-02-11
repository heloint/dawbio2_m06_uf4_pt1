const multer = require("multer");
const fs = require('fs');
const path = require('path');

/**
 * Function to configure the storage for the uploaded files
 * @function
 * @return {Object} - Multer configuration.
 */
const configureStorage = () => {
  return multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "uploads/");
    },
    filename: function (req, file, callback) {
        // If file exists, we don't upload.
        if (!fs.existsSync(path.join('uploads/',file.originalname))) {
            callback(null, file.originalname);
         } else {
            callback(new Error('File already exists!'), file.originalname);
        }
        // callback(null, file.originalname);
    },
  });
};

/**
 * Function to handle the registration of the uploaded file in the database.
 * @function
 * @param {Object} app - Express application
 * @param {Object} cors - Module to handle CORS.
 * @param {Object} cors - Module to handle CORS.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handleRegisterFileUpload = (app, cors, connection) => {
  app.post("/registerSequence", (req, res) => {


console.log({
    1:req.body.name,
       2: req.body.size,
       3: `${__dirname}/uploads/${req.body.name}`,
       4: req.body.gene,
       5: req.body.taxonomyID,
       6: req.body.uploadedBy
  });
    connection.query(
      ` INSERT INTO sequence_files VALUES
            (
                NEXT VALUE FOR sequence_file_id,
                ?, ?, ?, ?, ?, now(), ?
            ) `,
      [
        req.body.name,
        req.body.size,
        `${__dirname}/uploads/${req.body.name}`,
        req.body.gene,
        req.body.taxonomyID,
        req.body.uploadedBy
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
 * Function to handle the file upload
 * @function
 * @param {Object} app - Express application
 * @param {Object} cors - Module to handle CORS.
 */
const handleFileUpload = (app, cors, connection) => {
  const storage = configureStorage();
  const upload = multer({ storage: storage });

  app.post("/uploadSequence", upload.array("file"), (req, res) => {
    const file = req;

    // If no file received, then exception sent back.
    if (!file) {
      const error = new Error("Please upload a file");
      res.status(400).send({ error: error.message});
    }
  },
  (err, req, res, next)=> {
      console.log(err.message);
    res.status(400).json({error: err.message});
  });
};

/**
 * Function to handle getting all roles.
 * @function
 * @param {Object} app - Express application
 * @param {Object} cors - Module to handle CORS.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handleGetRoles = (app, cors, connection) => {
  app.get("/roles", cors(), function (req, res) {
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
 * @function
 * @param {Object} app - Express application
 * @param {Object} cors - Module to handle CORS.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handleGetLastUserID = (app, cors, connection) => {
  app.get("/lastUserID", cors(), function (req, res) {
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
 * @function
 * @param {Object} app - Express application
 * @param {Object} cors - Module to handle CORS.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handleGetUsers = (app, cors, connection) => {
  app.get("/users", cors(), function (req, res) {
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
 * Function to handle retrieving the informations about the user 
 * by it's username and password at the moment of the login process.
 * @function
 * @param {Object} app - Express application
 * @param {Object} cors - Module to handle CORS.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostLogin = (app, cors, connection) => {
  app.post("/login", cors(), function (req, res) {
    connection.query(
      `SELECT * FROM users WHERE username=? AND password=?`,
      [req.body.username, req.body.password],
      function (error, result, field) {
        if (error) {
          console.log(error);
          res.status(400).send({ results: false });
        } else {
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
};

/**
 * Function to handle adding new user to the database.
 * @function
 * @param {Object} app - Express application
 * @param {Object} cors - Module to handle CORS.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostAddUser = (app, cors, connection) => {
  app.post("/addUser", cors(), function (req, res) {
    connection.query(
      ` INSERT INTO users VALUES
            (NEXT VALUE FOR user_id,
                ?,
                ( SELECT role_id
                  FROM roles
                  WHERE role_name=?
                ),
                ?, ?, ?, ?, now()
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
 * @function
 * @param {Object} app - Express application
 * @param {Object} cors - Module to handle CORS.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostUserByID = (app, cors, connection) => {
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
 * @function
 * @param {Object} app - Express application
 * @param {Object} cors - Module to handle CORS.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostDeleteUserByID = (app, cors, connection) => {
  app.post("/deleteUserByID", cors(), function (req, res) {
    connection.query(
      `DELETE FROM users WHERE user_id=?`,
      [req.body.userID],
      function (error, result, field) {
        if (error) {
          console.log(error);
          res.status(400).send({ results: false });
        } else {
          console.log("Succesfully deleted user.");
          res.status(200).send({ result: true });
        }
      }
    );
  });
};

/**
 * Function to handle post request to update the 
 * user with the received datas.
 * @function
 * @param {Object} app - Express application
 * @param {Object} cors - Module to handle CORS.
 * @param {Object} connection - Connector instance to MySQL.
 */
const handlePostUpdateUser = (app, cors, connection) => {
  app.post("/updateUser", cors(), function (req, res) {
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
          console.log("Succesfully deleted user.");
          res.status(200).send({ result: true });
        }
      }
    );
  });
};

// Export functions.
module.exports = {
  handleFileUpload: handleFileUpload,
  handleRegisterFileUpload: handleRegisterFileUpload,
  handleGetRoles: handleGetRoles,
  handleGetLastUserID: handleGetLastUserID,
  handleGetUsers: handleGetUsers,
  handlePostLogin: handlePostLogin,
  handlePostAddUser: handlePostAddUser,
  handlePostUserByID: handlePostUserByID,
  handlePostDeleteUserByID: handlePostDeleteUserByID,
  handlePostUpdateUser: handlePostUpdateUser,
};
