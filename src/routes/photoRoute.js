const express = require("express");
const router = express.Router();
require("dotenv").config();

const upload = require("../utils/uploadMiddleWare");
const userRepo = require("../repos/userRepo");
const photoRepo = require("../repos/photoRepo");
const { createGridFSReadStream } = require("../service/gridfs-service");

//don't forget unit tests

//Final pass
//correct http codes
//does it need to be async
//async wrapper go/no go

router.post("/uploadPhoto", upload.single("image"), async (req, res) => {
  try {
    if (req.file) {
      const { originalname, mimetype, id, size } = req.file;
      const user = req.auth;
      const isPublic = req.query.isPublic;

      userRepo.addPhotoToUser(user, id, isPublic);

      res.status(201).json({ originalname, mimetype, id, size });
    } else {
      return res.status(400).json({ message: "No file" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/deletePhoto", async (req, res, next) => {
  const userId = req.auth.id;
  const photoId = req.body.photoId;

  try {
    const photoData = await photoRepo.getPhotoData(photoId);

    if (!photoData) {
      return res.sendStatus(404).json({ message: "Cannot find image" });
    }

    const isOwnPhoto = photoData?.contributorId.toString() === userId;

    if (isOwnPhoto) {
      await photoRepo.deletePhoto(photoId);

      return res.status(200).json({ message: "Photo deleted" });
    } else {
      return res.status(403).json({ message: "Cannot access file" });
    }
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/viewPhoto/:id", async (req, res) => {
  const requesterUserId = req.auth.id;
  const photoId = req.params.id;

  try {
    const photoData = await photoRepo.getPhotoData(photoId);

    if (!photoData) {
      return res.status(401).json({ message: "Cannot find image" });
    }

    const isOwnPhoto = photoData.contributorId.toString() === requesterUserId;

    if (photoData.isPublic || isOwnPhoto) {
      const readStream = createGridFSReadStream(photoId);
      readStream.pipe(res);
    } else {
      res.status(403).json({ message: "Cannot access file" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/viewPhotosByUser/:id", async (req, res) => {
  const page = req.query.page;
  const contributorId = req.params.id;
  const requesterUserId = req.auth.id;

  try {
    const allPhotoData = await photoRepo.getPhotosDataByUser(
      contributorId,
      page,
      requesterUserId
    );

    return res.json(allPhotoData);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/addComment", async (req, res, next) => {
  const { comment, photoId } = req.body;
  const commenterUserId = req.auth.id;
  const commentDate = new Date();

  try {
    const user = await userRepo.getUserFromId(commenterUserId);

    const result = await photoRepo.addCommentToPhoto(
      comment,
      photoId,
      commenterUserId,
      commentDate,
      user.email
    );

    if (result.error) {
      return res.status(result.code).json({ message: result.message });
    } else {
      return res.sendStatus(200);
    }
  } catch (err) {
    return res.send(500).json({ message: "Server error" });
  }
});

router.put("/changePhotoPrivacy", async (req, res, next) => {
  const { isPublic, photoId } = req.body;
  const userId = req.auth.id;

  try {
    const photoData = await photoRepo.getPhotoData(photoId);

    if (!photoData) {
      return res.status(401).json({ message: "Cannot find image" });
    }

    const isOwnPhoto = photoData.contributorId.toString() === userId;

    if (isOwnPhoto) {
      await photoRepo.updatePrivacy(photoId, isPublic);
      return res.status(200).json({ message: "Photo updated" });
    } else {
      return res.status(403).json({ message: "Cannot access file" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
