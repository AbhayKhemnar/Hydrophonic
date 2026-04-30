const express = require("express");
const multer = require("multer");
const { analyzeImage, chatWithAssistant } = require("../controllers/aiController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }

    return cb(null, true);
  }
});

const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (!error) return next();

    return res.status(400).json({
      success: false,
      message: error.message || "Invalid image upload"
    });
  });
};

router.post("/analyze-image", handleUpload, analyzeImage);
router.post("/chat", chatWithAssistant);

module.exports = router;
