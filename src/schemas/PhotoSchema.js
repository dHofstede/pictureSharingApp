const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  photoId: { type: mongoose.Types.ObjectId, ref: "photos.files" },
  comments: [
    {
      comment: {
        type: String,
        required: true,
      },
      commentDate: Date,
      commenterUserId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
      },
      commenterEmail: String,
    },
  ],
  contributorId: { type: mongoose.Types.ObjectId, ref: "users" },
  uploadDate: Date,
  isPublic: {
    type: Boolean,
    required: true,
  },
  isDeleted: Boolean,
});

module.exports = mongoose.model("Photo", photoSchema);
