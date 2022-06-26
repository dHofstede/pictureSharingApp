const express = require("express");
const jwt = require("jsonwebtoken");
const authRepo = require("../repos/authRepo");

const router = express.Router();

router.post("/authorize", async (req, res, next) => {
  const { email, password } = req.body;

  const result = await authRepo.authenticateUser(email, password);

  if (result.error) {
    res.status(401).json(result.message);
  } else {
    const accessToken = jwt.sign({ id: result._id }, process.env.SECRET, {
      expiresIn: "11h",
    });

    res.status(200).json({
      accessToken,
    });
  }
});

module.exports = router;
