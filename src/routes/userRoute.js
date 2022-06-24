const express = require("express");
const User = require("../schemas/UserSchema");
const userRepo = require("../repos/userRepo");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/createUser", async (req, res, next) => {
  const { email, password } = req.body;

  const newUser = await userRepo.createUser(email, password);

  if (!newUser && newUser.error) {
    return res.status(200).json({ message: newUser.message });
  } else {
    const accessToken = jwt.sign({ id: newUser.id }, process.env.SECRET, {
      expiresIn: "11h",
    });

    return res.status(200).json({ id: newUser.id, accessToken });
  }
});

module.exports = router;
