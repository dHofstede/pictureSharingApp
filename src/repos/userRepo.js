const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../schemas/UserSchema");
const Photo = require("../schemas/PhotoSchema");

const generatePassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const createUser = async (email, password) => {
  const emailIsTaken = await User.exists({ email: { $in: [email] } });

  if (emailIsTaken) {
    return { error: true, code: 400, message: "email is taken" };
  }

  const hashedPassword = await generatePassword(password);
  const newUser = new User({ email, passwordHash: hashedPassword });
  await newUser.save();

  return { id: newUser._id };
};

const addPhotoToUser = async (user, photoObjectId, isPublic) => {
  const uploadDate = new Date();

  const newPhoto = new Photo({
    photoId: photoObjectId,
    contributorId: user.id,
    uploadDate,
    isPublic,
    isDeleted: false,
  });

  return await newPhoto.save();
};

const getUserFromId = async (userId) => {
  const user = await User.findOne({
    _id: mongoose.Types.ObjectId(userId),
  });

  return user;
};

module.exports = { createUser, addPhotoToUser, getUserFromId };
