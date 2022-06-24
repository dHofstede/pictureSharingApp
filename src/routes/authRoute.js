const express = require("express");
const jwt = require("jsonwebtoken");
const authRepo = require("../repos/authRepo");

const router = express.Router();

router.post("/authorize", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await authRepo.authenticateUser(email, password);

  if (user) {
    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "11h",
    });

    res.json({
      accessToken,
      id: user.userId,
    });
  }
});

module.exports = router;
