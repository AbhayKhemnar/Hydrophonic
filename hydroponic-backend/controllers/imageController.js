const PlantImage = require("../models/PlantImage");
const asyncHandler = require("../utils/asyncHandler");
const { uploadImageBuffer } = require("../services/cloudStorageService");

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const imageUrl = await uploadImageBuffer(req.file.buffer, "hydroponic-platform/plants");

  const record = await PlantImage.create({
    farmer: req.user._id,
    imageUrl,
    capturedAt: req.body.capturedAt || Date.now(),
    aiResult: req.body.aiResult || undefined
  });

  res.status(201).json(record);
});

const getImageHistory = asyncHandler(async (req, res) => {
  const images = await PlantImage.find({ farmer: req.user._id }).sort({ capturedAt: -1 });
  res.json(images);
});

module.exports = {
  uploadImage,
  getImageHistory
};
