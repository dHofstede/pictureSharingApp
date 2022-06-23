const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();

// const storage = new GridFsStorage({
//   url: "mongodb://yourhost:27017/database", //process.env.DB_CONNECTION_STRING,
//   file: (req, file) => {
//     return {
//       bucketName: "photos",
//     };
//   },
// });

// storage.on("connectionFailed", (err) => {
//   console.log("conn fail");
//   console.log(err);
// });

// const storage2 = null;

// var upload = multer({
//   storage: storage,
//   onError: function (err, next) {
//     console.log("error", err);
//     next(err);
//   },
// });

// module.exports = upload;
