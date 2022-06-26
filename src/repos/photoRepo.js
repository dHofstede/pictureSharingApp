const mongoose = require("mongoose");
require("dotenv").config();

const Photo = require("../schemas/PhotoSchema");
const { createGridFSReadStream } = require("../utils/gridfsService");

const getPhotosDataByUser = async (contributorId, page, requesterUserId) => {
  const skip = (Number(page) - 1) * process.env.MAX_IMAGE_REQUEST_COUNT;

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
    .limit(process.env.MAX_IMAGE_REQUEST_COUNT);

  return allPhotoIds;
};

const getPhotoData = async (photoId) => {
  try {
    return await Photo.findOne({
      photoId: mongoose.Types.ObjectId(photoId),
    });
  } catch (error) {
    return { error: true, code: 500, message: "Server error" };
  }
};

const getPhotoReadStream = async (photoId) => {
  const readStream = createGridFSReadStream(photoId);
  return readStream;
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

    try {
      return await photo.save();
    } catch (error) {
      return { error: true, code: 400, message: error._message };
    }
  } else {
    return { error: true, message: "Photo not found", code: 404 };
  }
};

const deletePhoto = async (photoId) => {
  const photo = await getPhotoData(photoId);

  if (photo) {
    photo.isDeleted = true;
    return await photo.save();
  } else {
    return { error: true, message: "Photo not found", code: 404 };
  }
};

module.exports = {
  getPhotosDataByUser,
  getPhotoData,
  getPhotoReadStream,
  addComment,
  changePhotoPrivacy,
  deletePhoto,
};
