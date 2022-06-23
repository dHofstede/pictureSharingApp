const multer = require("multer");
const { storage } = require("../service/gridfs-service");

const upload = multer({
  storage,
});

module.exports = upload;
