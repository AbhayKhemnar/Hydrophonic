const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  createDeviceCommand,
  getFarmerCommands,
  getLatestDeviceCommand,
  markCommandExecuted
} = require("../controllers/deviceCommandController");

const router = express.Router();

router.post("/", authMiddleware, allowRoles("farmer"), createDeviceCommand);
router.get("/my", authMiddleware, allowRoles("farmer"), getFarmerCommands);
router.get("/latest/:farmerId", getLatestDeviceCommand);
router.put("/:id/executed", markCommandExecuted);

module.exports = router;
