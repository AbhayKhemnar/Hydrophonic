const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createComplaint,
  getMyComplaints
} = require("../controllers/complaintController");

const router = express.Router();

router.use(authMiddleware);
router.post("/", createComplaint);
router.get("/my", getMyComplaints);

module.exports = router;
