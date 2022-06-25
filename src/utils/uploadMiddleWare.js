const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();

const storage = new GridFsStorage({
  url: process.env.DB_CONNECTION_STRING,
  cache: true,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve) => {
      const fileInfo = {
        filename: file.originalname,
        bucketName: "photos",
      };
      resolve(fileInfo);
    });
  },
});

storage.on("connectionFailed", (err) => {
  console.log("Storage connection failed");
  console.log(err.message);
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1000 }, //20 mb upload limit
});

module.exports = upload;
