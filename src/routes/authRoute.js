const express = require("express");
const jwt = require("jsonwebtoken");
const authRepo = require("../repos/authRepo");

const router = express.Router();

router.post("/authorize", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await authRepo.authenticateUser(email, password);

  if (user.error) {
    return res.status(401).json(user.message);
  } else {
    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "11h",
    });

    res.status(200).json({
      accessToken,
      id: user.userId,
    });
  }
});

module.exports = router;
