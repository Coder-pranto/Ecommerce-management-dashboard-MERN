const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname); // Get the file extension
    cb(null, file.fieldname + "-" + Date.now() + extension); // Set the file name to include the extension
  },
});

const imgUpload = multer({ storage: storage });

exports.imgUpload = imgUpload;
