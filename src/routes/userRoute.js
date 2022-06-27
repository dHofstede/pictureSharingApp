const express = require("express");
const emailValidator = require("node-email-validation");
const userRepo = require("../repos/userRepo");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/createUser", async (req, res) => {
  const { email, password } = req.body;

  const validEmail = emailValidator.is_email_valid(email);

  if (!validEmail) {
    return res.status(400).json({ message: "Invalid email" });
  }

  try {
    const createResult = await userRepo.createUser(email, password);

    if (createResult.error) {
      res.status(createResult.code).json({ message: createResult.message });
    } else {
      const accessToken = jwt.sign(
        { id: createResult.id },
        process.env.SECRET,
        {
          expiresIn: "11h",
        }
      );

      res.json({ accessToken });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
