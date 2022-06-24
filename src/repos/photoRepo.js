const mongoose = require("mongoose");
const Photo = require("../schemas/PhotoSchema");
const { getGridFSFilesByUser } = require("../service/gridfs-service");
const { createGridFSReadStream } = require("../service/gridfs-service");
const { createGridFSReadStreamArray } = require("../service/gridfs-service");

const NUM_PHOTOS_PER_CALL = 3;

const getPhotosDataByUser = async (contributorId, page, requesterUserId) => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);

  const skip = (Number(page) - 1) * NUM_PHOTOS_PER_CALL;

  // Get gridfs file for specific user.
  const allPhotoIds = await Photo.find({
    contributorId: mongoose.Types.ObjectId(contributorId), // userId that uploaded the photo
    $or: [
      { isPublic: true }, //photo must be public or...
      { contributorId: mongoose.Types.ObjectId(requesterUserId) }, // the requester is the one who uploaded the photo
    ],
    isDeleted: false,
  })
    .sort({ uploadDate: -1 })
    .skip(skip)
    .limit(NUM_PHOTOS_PER_CALL);

  return allPhotoIds;
};

const getPhotoData = async (photoId) => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);

  console.log("photoId: ", photoId);

  return await Photo.findOne({
    photoId: mongoose.Types.ObjectId(photoId),
  });
};

const addCommentToPhoto = async (
  comment,
  photoId,
  commenterUserId,
  commentDate,
  commenterEmail
) => {
  const photo = await Photo.findOne({
    photoId: mongoose.Types.ObjectId(photoId),
  });

  if (photo) {
    photo.comments.push({
      comment,
      commenterUserId,
      commentDate,
      commenterEmail,
    });
    const result = await photo.save();

    return result;
  } else {
    return { error: true, code: 404, message: "Photo not found" };
  }
};

const updatePrivacy = async (photoId, isPublic) => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  const photo = await Photo.findOne({
    photoId: mongoose.Types.ObjectId(photoId),
  });

  photo.isPublic = isPublic;
  const result = await photo.save();

  return result;
};

const deletePhoto = async (photoId) => {
  const photo = await Photo.findOne({
    photoId: mongoose.Types.ObjectId(photoId),
  });

  photo.isDeleted = true;
  const result = await photo.save();

  return result;
};

module.exports = {
  getPhotosDataByUser,
  getPhotoData,
  addCommentToPhoto,
  updatePrivacy,
  deletePhoto,
};
