const express = require("express");
const path = require("path");
const router = express.Router();
const upload = require("../utils/uploadMiddleWare");
const mongoose = require("mongoose");
require("dotenv").config();
const userRepo = require("../repos/userRepo");
const photoRepo = require("../repos/photoRepo");
const asyncWrapper = require("../utils/async-wrapper");
const { getGridFSFiles } = require("../service/gridfs-service");
const { createGridFSReadStream } = require("../service/gridfs-service");
var MultiStream = require("multistream");

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

router.post(
  "/uploadPhoto",
  upload.single("image"),
  asyncWrapper(async (req, res) => {
    if (req.file) {
      const { originalname, mimetype, id, size } = req.file;
      const user = req.auth;
      const isPublic = req.query.isPublic;
      userRepo.addPhotoToUser(user, id, isPublic);
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

router.get(
  "/viewPhotos/:id",
  asyncWrapper(async (req, res) => {
    const image = await getGridFSFiles(req.params.id);

    if (!image) {
      return res.status(404).send({ message: "Image not found" });
    }
    res.setHeader("content-type", image.contentType);
    const readStream = createGridFSReadStream(req.params.id);
    readStream.pipe(res);
  })
);

router.get(
  "/viewPhotosByUserOld/:id",
  asyncWrapper(async (req, res) => {
    const page = req.query.page;
    console.log(page);
    console.log(req.params);
    const readStream = await photoRepo.getAllPhotos(req.params.id, page);

    readStream.pipe(res);
  })
);

router.get(
  "/viewPhotosByUser/:id",
  asyncWrapper(async (req, res) => {
    const page = req.query.page;
    console.log(page);
    console.log(req.params);
    const readStreams = await photoRepo.getAllPhotos(req.params.id, page);

    Promise.all(readStreams)
      .then((fileNames) => {
        response.data = fileNames;
        res.json(response);
      })
      .catch((error) => {
        res.status(400).json(response);
      });
  })
);
router.get(
  "/viewPhotosByUserOld/:id",
  asyncWrapper(async (req, res) => {
    const page = req.query.page;
    console.log(page);
    console.log(req.params);

    const streams = await photoRepo.getAllPhotos(req.params.id, page);

    streams.forEach((stream) => {
      stream.pipe(res);
    });
  })
);

// router.get(
//   "/viewPhotosByUser/:id",
//   asyncWrapper(async (req, res) => {
//     const page = req.query.page;
//     console.log(page);
//     console.log(req.params);

//     const streams = await photoRepo.getAllPhotos(req.params.id, page);

//     streams.forEach((stream) => {
//       var rest;
//       stream.pipe(rest);
//       res.writeHead(200, { "Content-Type": "image/jpeg" });
//       res.write(rest);
//     });
//     res.end;
//   })
// );

router.put("/addCommentToPhoto", async (req, res, next) => {
  const { commentBody, commenterId, photoId } = req.body;
  const commentDate = new Date();

  res.sendStatus(200);
});

module.exports = router;

/*the general idea
User submits a photo, we want to use a stream to stream it into gridfs
user photos array gets updated with ref to gridfs file?
Also create a thumbnail version? endpoint to get thumbnails also passes id of each associated photo
  That way a user could click on a photo and request the full res photo










*/
