const express = require("express");
const { createSensorData } = require("../controllers/sensorDataController");

const router = express.Router();

router.post("/", createSensorData);

module.exports = router;
