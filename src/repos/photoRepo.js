const mongoose = require("mongoose");
require("dotenv").config();

const Photo = require("../schemas/PhotoSchema");
const { createGridFSReadStream } = require("../utils/gridfsService");

const getPhotosDataByUser = async (contributorId, page, requesterUserId) => {
  const skip = (Number(page) - 1) * process.env.MAX_IMAGE_REQUEST_COUNT;

  // Get gridfs file for specific user.
  return await Photo.find({
    contributorId: mongoose.Types.ObjectId(contributorId), // userId that uploaded the photo
    $or: [
      { isPublic: true }, //photo must be public or...
      { contributorId: mongoose.Types.ObjectId(requesterUserId) }, // the requester is the one who uploaded the photo
    ],
    isDeleted: false,
  })
    .sort({ uploadDate: -1 })
    .skip(skip)
    .limit(process.env.MAX_IMAGE_REQUEST_COUNT);
};

const getPhotoData = async (photoId) => {
  return await Photo.findOne({
    photoId: mongoose.Types.ObjectId(photoId),
  });
};

const getPhotoReadStream = async (photoId) => {
  return createGridFSReadStream(photoId);
};

const addComment = async (data) => {
  const photo = await getPhotoData(data.photoId);

  if (photo) {
    photo.comments.unshift(data);
    return await photo.save();
  } else {
    return { error: true, message: "Photo not found", code: 404 };
  }
};

const changePhotoPrivacy = async (photoId, isPublic) => {
  const photo = await getPhotoData(photoId);

  if (photo) {
    photo.isPublic = isPublic;
    return await photo.save();
  } else {
    return { error: true, message: "Photo not found", code: 404 };
  }
};

const deletePhoto = async (photo) => {
  photo.isDeleted = true;
  return await photo.save();
};

module.exports = {
  getPhotosDataByUser,
  getPhotoData,
  getPhotoReadStream,
  addComment,
  changePhotoPrivacy,
  deletePhoto,
};
