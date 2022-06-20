const express = require("express");
const router = express.Router();

router.get("/auth", (req, res, next) => {
  res.status(200).send("call received");
});

module.exports = router;
