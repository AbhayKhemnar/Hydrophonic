const SensorData = require("../models/SensorData");
const Alert = require("../models/Alert");
const DeviceRule = require("../models/DeviceRule");
const asyncHandler = require("../utils/asyncHandler");

const normalizePayload = (body) => ({
  farmer: body.farmer,
  deviceId: body.deviceId,
  farmName: body.farmName,
  ph: Number(body.ph ?? body.pH),
  tds: Number(body.tds ?? body.TDS),
  temperature: Number(body.temperature ?? body.temp),
  humidity: Number(body.humidity ?? 0),
  waterLevel: Number(body.waterLevel ?? body.water_level ?? body.waterlevel)
});

const evaluateRules = async (reading) => {
  const rules = await DeviceRule.find({
    farmer: reading.farmer,
    isActive: true
  });

  const triggered = [];

  for (const rule of rules) {
    const currentValue = reading[rule.parameter];
    const matches =
      (rule.comparison === "lt" && currentValue < rule.value) ||
      (rule.comparison === "gt" && currentValue > rule.value);

    if (matches) {
      triggered.push({
        device: rule.device,
        action: rule.action,
        ruleName: rule.ruleName
      });

      await Alert.create({
        farmer: reading.farmer,
        type: rule.parameter,
        message: `${rule.ruleName}: ${rule.device} should turn ${rule.action}`,
        severity: rule.parameter === "waterLevel" ? "high" : "medium"
      });
    }
  }

  return triggered;
};

const createSensorReading = asyncHandler(async (req, res) => {
  const payload = normalizePayload(req.body);

  if (
    !Number.isFinite(payload.ph) ||
    !Number.isFinite(payload.tds) ||
    !Number.isFinite(payload.temperature) ||
    !Number.isFinite(payload.waterLevel)
  ) {
    return res.status(400).json({ message: "Invalid sensor payload" });
  }

  const reading = await SensorData.create(payload);
  const triggeredRules = await evaluateRules(reading);

  res.status(201).json({
    success: true,
    data: reading,
    triggeredRules
  });
});

const getLatestReadings = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "farmer"
      ? { farmer: req.user._id }
      : req.query.farmer
        ? { farmer: req.query.farmer }
        : {};

  const reading = await SensorData.findOne(filter).sort({ createdAt: -1 });
  res.json(reading);
});

const getSensorHistory = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "farmer"
      ? { farmer: req.user._id }
      : req.query.farmer
        ? { farmer: req.query.farmer }
        : {};

  const history = await SensorData.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json(history);
});

const getAlerts = asyncHandler(async (req, res) => {
  const filter = req.user.role === "farmer" ? { farmer: req.user._id } : {};
  const alerts = await Alert.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json(alerts);
});

module.exports = {
  createSensorReading,
  getLatestReadings,
  getSensorHistory,
  getAlerts
};
