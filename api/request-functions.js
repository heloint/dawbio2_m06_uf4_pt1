const multer = require('multer');

/**
 * Function to configure the storage for the uploaded files
 * @function
 * @return {Object}
 */
const configureStorage = () => {
    return multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'uploads/');
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });
};

/**
 * Function to handle the file upload
 * @function
 * @param {Object} app - Express application
 */
const handleFileUpload = (app) => {
    const storage = configureStorage();
    const upload = multer({ storage: storage });

    app.post('/uploadFasta', [cors(), upload.array("file")], (req, res) => {
        const file = req;
        console.log(req.body);
        console.log(req.files);

        if (!file) {
            const error = new Error('Please upload a file');
            error.httpStatusCode = 400;
            return next(error);
        }

        res.status(200).send({ result: true });
    });
};

module.exports = {
    handleFileUpload,
};
