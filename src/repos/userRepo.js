const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../schemas/UserSchema");
const Photo = require("../schemas/PhotoSchema");

const generatePassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const createUser = async (email, password) => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);

  const emailIsTaken = await User.exists({ email });

  if (emailIsTaken) {
    mongoose.connection.close();
    return { error: true, message: "email is taken" };
  }

  const hashedPassword = await generatePassword(password);
  const newUser = new User({ email, passwordHash: hashedPassword });

  await newUser.save();

  mongoose.connection.close();
  return { id: newUser._id };
};

const addPhotoToUser = async (user, photoObjectId, isPublic) => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);

  console.log("isPublic: ", isPublic);
  const uploadDate = new Date();

  const newPhoto = new Photo({
    photoId: photoObjectId,
    contributorId: user.id,
    uploadDate,
    isPublic,
  });

  await newPhoto.save();

  return true;
};

module.exports = { createUser, addPhotoToUser };
