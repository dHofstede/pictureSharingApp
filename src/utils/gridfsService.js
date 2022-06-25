const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

Grid.mongo = mongoose.mongo;

let gridFSBucket;

mongoose.connection.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "photos",
  });
});

const createGridFSReadStream = (id) => {
  return gridFSBucket.openDownloadStream(mongoose.Types.ObjectId(id));
};

module.exports.createGridFSReadStream = createGridFSReadStream;
