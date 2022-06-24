const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  photoId: { type: mongoose.Types.ObjectId, ref: "contents.files" },
  comments: [
    { body: String, date: Date, commenterId: mongoose.Types.ObjectId },
  ],
  contributorId: mongoose.Types.ObjectId,
  uploadDate: Date,
  isPublic: Boolean,
});

module.exports = mongoose.model("Photo", photoSchema);
