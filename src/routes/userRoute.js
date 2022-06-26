const express = require("express");
const User = require("../schemas/UserSchema");
const userRepo = require("../repos/userRepo");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/createUser", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await userRepo.createUser(email, password);

    if (!result || result.error) {
      res.status(400).json({ message: result.message });
    } else {
      const accessToken = jwt.sign({ id: result.id }, process.env.SECRET, {
        expiresIn: "11h",
      });

      res.status(200).json({ accessToken });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
