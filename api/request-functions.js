const multer = require("multer");

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
      callback(null, file.originalname);
    },
  });
};

/**
 * Function to handle the file upload
 * @function
 * @param {Object} app - Express application
 */
const handleFileUpload = (app, cors) => {
  const storage = configureStorage();
  const upload = multer({ storage: storage });

  app.post("/uploadFasta", [cors(), upload.array("file")], (req, res) => {
    const file = req;

    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }

    res.status(200).send({ result: true });
  });
};

/**
 * Function to handle getting all roles.
 * @function
 * @param {Object} app - Express application
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

module.exports = {
  handleFileUpload: handleFileUpload,
  handleGetRoles: handleGetRoles,
  handleGetLastUserID: handleGetLastUserID,
  handleGetUsers: handleGetUsers,
  handlePostLogin: handlePostLogin,
  handlePostAddUser: handlePostAddUser,
  handlePostUserByID: handlePostUserByID, 
};
