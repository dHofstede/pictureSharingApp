const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  photoId: {
    type: mongoose.Types.ObjectId,
    ref: "photos.files",
    required: true,
  },
  comments: [
    {
      comment: {
        type: String,
        required: true,
      },
      date: Date,
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
      },
      email: String,
    },
  ],
  contributorId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  uploadDate: Date,
  isPublic: {
    type: Boolean,
    required: true,
  },
  isDeleted: Boolean,
});

module.exports = mongoose.model("Photo", photoSchema);
