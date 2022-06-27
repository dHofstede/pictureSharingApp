const express = require("express");
const router = express.Router();
require("dotenv").config();

const upload = require("../utils/uploadMiddleWare");
const userRepo = require("../repos/userRepo");
const photoRepo = require("../repos/photoRepo");

router.post("/uploadPhoto", upload.single("image"), async (req, res) => {
  try {
    if (req.file) {
      const { originalname, mimetype, id, size } = req.file;
      const user = req.auth;
      const isPublic = req.query.isPublic;

      const createResult = await userRepo.addPhotoToUser(user, id, isPublic);

      if (createResult.error) {
        res.status(createResult.code).json(createResult.message);
      } else {
        res.json({ originalname, mimetype, id, size });
      }
    } else {
      res.status(400).json({ message: "No file" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/deletePhoto", async (req, res) => {
  const userId = req.auth.id;
  const photoId = req.body.photoId;

  try {
    const photoData = await photoRepo.getPhotoData(photoId);

    if (!photoData) {
      return res.status(404).json({ message: "Cannot find image" });
    }

    const isOwnPhoto = photoData?.contributorId.toString() === userId;

    if (isOwnPhoto) {
      await photoRepo.deletePhoto(photoData);
      res.json({ message: "Photo deleted" });
    } else {
      res.status(403).json({ message: "Cannot access file" });
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
      return res.status(404).json({ message: "Cannot find image" });
    }

    const isOwnPhoto = photoData.contributorId.toString() === requesterUserId;

    if (photoData.isPublic || isOwnPhoto) {
      const readStream = await photoRepo.getPhotoReadStream(photoId);
      readStream.pipe(res);
    } else {
      res.status(403).json({ message: "Cannot access file" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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

    res.json(allPhotoData);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/addComment", async (req, res) => {
  const { comment, photoId } = req.body;
  const userId = req.auth.id;
  const date = new Date();

  try {
    const user = await userRepo.getUserFromId(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateResult = await photoRepo.addComment({
      comment,
      photoId,
      userId,
      date,
      email: user.email,
    });

    if (updateResult.error) {
      res.status(updateResult.code).json({ message: updateResult.message });
    } else {
      res.json({ message: "Comment added" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/changePhotoPrivacy", async (req, res) => {
  const { isPublic, photoId } = req.body;
  const userId = req.auth.id;

  try {
    const photoData = await photoRepo.getPhotoData(photoId);

    if (photoData.error) {
      return res.status(phoneData.code).json({ message: phoneData.message });
    }

    const isOwnPhoto = photoData.contributorId.toString() === userId;

    if (isOwnPhoto) {
      const updateResult = await photoRepo.changePhotoPrivacy(
        photoId,
        isPublic
      );

      if (updateResult.error) {
        res.status(updateResult.code).json(updateResult.message);
      } else {
        res.json({ message: "Photo updated" });
      }
    } else {
      res.status(403).json({ message: "Cannot access file" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
