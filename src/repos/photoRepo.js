const mongoose = require("mongoose");
const mongodb = require("mongodb");
const createReadStream = require("fs");
const fs = require("fs");

const streamFiles = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "test2",
  });

  const filename =
    "C:\\Users\\Dan\\workspace\\pictureSharingApp\\tempFolder\\bigImage.jpg";

  const _id = mongoose.Types.ObjectId();
  const readStream = fs.createReadStream(filename);
  const writeStream = gridFSBucket.createWriteStream({
    _id,
    filename,
  });
  let stream = readStream.pipe(writeStream);

  stream.on("finish", async () => {
    console.log("done");
  });
};

const uploadPhoto = async () => {
  //   var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
  //     bucketName: "test2",
  //   });

  //   const filename =
  //     "C:\\Users\\Dan\\workspace\\pictureSharingApp\\tempFolder\\bigImage.jpg";

  //   const _id = mongoose.Types.ObjectId();
  //   const readStream = fs.createReadStream(filename);
  //   const writeStream = gridFSBucket.createWriteStream({
  //     _id,
  //     filename,
  //   });
  //   await readStream.pipe(writeStream);
  await streamFiles();
  //mongoose.connection.close();
};

const getPhoto = async (imageId) => {
  var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
  const _id = mongoose.Types.ObjectId();
  const filename = "bigImage.jpg";
  const writeStream = fs.createWriteStream(filename);
  const readStream = gridFSBucket.createReadStream({ _id, filename });
  readStream.pipe(writeStream);
};

module.exports = { getPhoto, uploadPhoto };
