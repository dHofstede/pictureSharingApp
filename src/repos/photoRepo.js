const mongoose = require("mongoose");
const Photo = require("../schemas/PhotoSchema");
const { getGridFSFilesByUser } = require("../service/gridfs-service");
const { createGridFSReadStream } = require("../service/gridfs-service");
const { createGridFSReadStreamArray } = require("../service/gridfs-service");

const NUM_PHOTOS_PER_CALL = 3;

const getAllPhotoIds = async (contributorId) => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);

  console.log(contributorId);

  const allPhotoIds = await Photo.find({
    contributorId: mongoose.Types.ObjectId(contributorId),
  });

  console.log(allPhotoIds);

  return allPhotoIds;
};

const getAllPhotos = async (contributorId, page) => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);

  const skip = (Number(page) - 1) * NUM_PHOTOS_PER_CALL;

  const allPhotoIds = await Photo.find({
    contributorId: mongoose.Types.ObjectId(contributorId),
  }).sort({ uploadDate: -1 });
  // .skip(skip)
  // .limit(NUM_PHOTOS_PER_CALL);

  if (allPhotoIds) {
    const objectIds = Object.keys(allPhotoIds)
      .filter((key) => allPhotoIds[key].photoId)
      .map((key) => allPhotoIds[key].photoId);

    const images = await getGridFSFilesByUser(objectIds);

    console.log(images);

    return createGridFSReadStream(images);
  } else {
    return null;
  }

  return allPhotoIds;
};

module.exports = { getAllPhotos };
