const mongoose = require("mongoose");
require("dotenv").config();
const dbPath = process.env.DB_CONNECTION_STRING;

const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;

const conn = mongoose.createConnection(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

conn.on("error", () => {
  console.log("DB Error");
});

let gfs, gridFSBucket;

conn.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "photos",
  });

  gfs = Grid(conn.db);
  gfs.collection("photos");
  console.log("DB Open");
});

const getGridFSFilesByUser = (allUserPhotoIds) => {
  return new Promise((resolve, reject) => {
    gfs.files
      .find({
        _id: {
          $in: allUserPhotoIds,
        },
      })
      .toArray(function (err, files) {
        if (err) reject(err);
        if (!files || files.length === 0) {
          resolve(null);
        } else {
          resolve(files);
        }
      });
  });
};

const createGridFSReadStream = (id) => {
  return gridFSBucket.openDownloadStream(mongoose.Types.ObjectId(id));
};

const storage = new GridFsStorage({
  url: dbPath,
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

storage.on("connection", () => {
  console.log("Gridfs success");
});

storage.on("connectionFailed", (err) => {
  console.log("Connection failed");
  console.log(err.message);
});

module.exports = mongoose;
module.exports.storage = storage;
module.exports.createGridFSReadStream = createGridFSReadStream;
module.exports.getGridFSFilesByUser = getGridFSFilesByUser;
module.exports.gfs = gfs;
