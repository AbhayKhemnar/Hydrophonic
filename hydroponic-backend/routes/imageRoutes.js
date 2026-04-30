const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  uploadImage,
  getImageHistory
} = require("../controllers/imageController");

const router = express.Router();

router.use(authMiddleware, allowRoles("farmer"));
router.post("/upload", upload.single("image"), uploadImage);
router.get("/history", getImageHistory);

module.exports = router;
