const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../schemas/UserSchema");

const isPasswordMatch = async (password, toCompare) => {
  return await bcrypt.compare(password, toCompare);
};

const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { error: true, message: "invalid credentials" };
  }

  const validCredentials = await isPasswordMatch(password, user.passwordHash);

  if (!validCredentials) {
    return { error: true, message: "invalid credentials" };
  } else {
    return user;
  }
};

module.exports = { authenticateUser };
