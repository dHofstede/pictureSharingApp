const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  photoId: { type: mongoose.Types.ObjectId, ref: "contents.files" },
  comments: [
    {
      comment: String,
      commentDate: Date,
      commenterUserId: mongoose.Types.ObjectId,
      commenterEmail: String,
    },
  ],
  contributorId: mongoose.Types.ObjectId,
  uploadDate: Date,
  isPublic: Boolean,
  isDeleted: Boolean,
});

module.exports = mongoose.model("Photo", photoSchema);
