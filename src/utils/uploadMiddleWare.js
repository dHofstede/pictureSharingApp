const multer = require("multer");
const { storage } = require("../service/gridfs-service");

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1000 }, //20 mb upload limit
});

module.exports = upload;
