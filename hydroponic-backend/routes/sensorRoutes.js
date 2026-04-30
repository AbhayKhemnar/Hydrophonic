const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  createSensorReading,
  getLatestReadings,
  getSensorHistory,
  getAlerts
} = require("../controllers/sensorController");

const router = express.Router();

router.post("/sensor-data", createSensorReading);
router.post("/", authMiddleware, allowRoles("farmer", "admin"), createSensorReading);
router.get("/latest", authMiddleware, getLatestReadings);
router.get("/history", authMiddleware, getSensorHistory);
router.get("/alerts", authMiddleware, getAlerts);

module.exports = router;
