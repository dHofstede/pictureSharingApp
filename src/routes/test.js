const express = require("express");
const router = express.Router();

router.get("/test", (req, res, next) => {
  const user = req.auth;

  return res.status(200).json(user);
});

module.exports = router;
