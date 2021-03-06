const express = require("express");
const jwt = require("jsonwebtoken");
const authRepo = require("../repos/authRepo");

const router = express.Router();

router.post("/authorize", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authRepo.authenticateUser(email, password);

    if (result.error) {
      res.status(result.code).json(result.message);
    } else {
      const accessToken = jwt.sign({ id: result._id }, process.env.SECRET, {
        expiresIn: "1h",
      });

      res.json({
        accessToken,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
