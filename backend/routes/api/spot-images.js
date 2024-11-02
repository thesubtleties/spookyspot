const express = require("express");
const multer = require("multer");
const Minio = require("minio");
const crypto = require("crypto");
const { requireAuth } = require("../../utils/auth");
const { SpotImage } = require("../../db/models");
const { Spot } = require("../../db/models");
const { combineTableNames } = require("sequelize/lib/utils");

const router = express.Router();
console.log("Loading spot-images routes...");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image file"), false);
    }
  },
});

const minioClient = new Minio.Client({
  endPoint: "storage.sbtl.dev",
  port: 443,
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const generateFileName = (originalname) => {
  const ext = originalname.split(".").pop().toLowerCase();
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString("hex");
  return `${timestamp}-${random}.${ext}`;
};

router.post(
  "/upload",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const filename = generateFileName(req.file.originalname);

      await minioClient.putObject("spookyspot", filename, req.file.buffer);
      const url = `https://storage.sbtl.dev/spookyspot/${filename}`;
      res.status(201).json({ url });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        message: "Upload failed",
        error: error.message,
      });
    }
  }
);
// delete a spot image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  try {
    const spotImage = await SpotImage.findByPk(imageId, {
      include: {
        model: Spot,
        attributes: ["ownerId"],
      },
    });

    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    if (spotImage.Spot.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    try {
      const filename = spotImage.url.split("/").pop();
      await minioClient.removeObject("spookyspot", filename);
    } catch (minioError) {
      console.error("MinIO deletion error:", minioError);
    }

    await spotImage.destroy();

    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
