const express = require("express");
const path = require("path");
const router = express.Router();
const upload = require("../utils/uploadMiddleWare2");
const mongoose = require("mongoose");
require("dotenv").config();
const photoRepo = require("../repos/photoRepo");
const asyncWrapper = require("../utils/async-wrapper");

const createReadStream = require("fs");
const createModel = require("mongoose-gridfs");

const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();

// const storage = new GridFsStorage({
//   url: process.env.DB_CONNECTION_STRING,
//   file: (req, file) => {
//     return {
//       bucketName: "photos",
//     };
//   },
// });

// const uploadFile = async (req, res, next) => {
//   const upload = multer({
//     storage: storage,
//   }).single("image");
//   //const upload = multer().single('yourFileNameHere');

//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//     } else if (err) {
//       // An unknown error occurred when uploading.
//     }
//     // Everything went fine.
//     next();
//   });
// };

// const storage = new GridFsStorage({
//   url: process.env.DB_CONNECTION_STRING,
//   file: (req, file) => {
//     return {
//       bucketName: "photos",
//     };
//   },
// });

// const storage2 = null;

// var upload = multer({
//   storage: storage2,
//   fileFilter: function (req, file, callback) {
//     var ext = path.extname(file.originalname);
//     if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
//       return callback(new Error("Only images are allowed"));
//     }
//     callback(null, true);
//   },
//   limits: {
//     fileSize: 1024 * 1024,
//   },
// }).single("image");

//Endpoints
//upload a photo
//  specify public or private
//  change privacy settings
//delete a photo

//view photos by user id
//  viewer can view their own private and public photos and comments
//  viewer can view public photos of others and comments
//  paginated results
//add comment to photo
//  are comments viewable by all? does requesting photos from a user include the comments? if not who can see the comments?

//don't forget unit tests

//Final pass
//correct http codes
//does it need to be async

router.post("/uploadPhoto", async (req, res, next) => {
  // const fileName = req.files.image.originalFilename;
  // console.log(req.files.image.originalFilename);
  // await photoRepo.uploadPhoto("bigImage.jpg");
  // return res.status(200).json({ success: true });
  //user passes photo
  //validate file type
  //validate size
  //look for privacy setting
});

// router.post(
//   "/uploadPhoto1",
//   upload.single("image"),
//   async function (req, res, next) {
//     return res.status(200).json({ location: req.file });
//   }
// );

router.post(
  "/uploadPhoto",
  upload.single("image"),
  asyncWrapper(async (req, res) => {
    if (req.file) {
      const { originalname, mimetype, id, size } = req.file;
      res.send({ originalname, mimetype, id, size });
    } else {
      return res.status(400).json({ message: "No file" });
    }
  })
);

router.put("/deletePhoto", async (req, res, next) => {
  //don't actually delete, just update with deleted bool and date that it was deleted at.

  //await userRepo.updateUser(updatedUserData); pass user id from user

  res.sendStatus(200);
});

// const connection = mongoose.createConnection(process.env.DB_CONNECTION_STRING);

router.get("/viewPhotos/:id", async (req, res, next) => {
  photoRepo.getPhoto(req.params.id);

  // console.log(req.params.id);
  // //View paginated photos and comments from other users which are marked as public and not marked as deleted
  // //View their own paginated photos and comments which are not marked as deleted

  // var id = req.params.id;
  // gfs = Grid(connection.db, mongoose.mongo);

  // gfs
  //   .collection("test")
  //   .findOne({ _id: mongoose.Types.ObjectId(id) }, (err, file) => {
  //     if (err) {
  //       // report the error
  //       console.log(err);
  //     } else {
  //       // detect the content type and set the appropriate response headers.
  //       let mimeType = file.contentType;
  //       if (!mimeType) {
  //         mimeType = mime.lookup(file.filename);
  //       }
  //       res.set({
  //         "Content-Type": mimeType,
  //       });

  //       const readStream = gfs.createReadStream({
  //         _id: id,
  //       });
  //       readStream.on("error", (err) => {
  //         // report stream error
  //         console.log(err);
  //       });
  //       // the response will be the file itself.
  //       readStream.pipe(res);
  //     }
  //   });

  res.sendStatus(200);
});

router.put("/addCommentToPhoto", async (req, res, next) => {
  //add comment to photo, record date, user, comment, and photoId

  res.sendStatus(200);
});

module.exports = router;

/*the general idea
User submits a photo, we want to use a stream to stream it into gridfs
user photos array gets updated with ref to gridfs file?
Also create a thumbnail version? endpoint to get thumbnails also passes id of each associated photo
  That way a user could click on a photo and request the full res photo










*/
