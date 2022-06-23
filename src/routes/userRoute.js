const express = require("express");
const User = require("../schemas/UserSchema");
const userRepo = require("../repos/userRepo");

const router = express.Router();

router.post("/createUser", async (req, res, next) => {
  const { email, password } = req.body;

  const newUserId = await userRepo.createUser(email, password);

  if (newUser.error) {
    return res.status(200).json({ message: newUser.message });
  } else {
    return res.status(200).json({ id: newUserId });
  }
});

module.exports = router;
