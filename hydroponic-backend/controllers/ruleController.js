const DeviceRule = require("../models/DeviceRule");
const DeviceCommand = require("../models/DeviceCommand");
const asyncHandler = require("../utils/asyncHandler");

const createRule = asyncHandler(async (req, res) => {
  const rule = await DeviceRule.create({
    ...req.body,
    farmer: req.user._id
  });

  res.status(201).json(rule);
});

const getRules = asyncHandler(async (req, res) => {
  const rules = await DeviceRule.find({ farmer: req.user._id }).sort({ createdAt: -1 });
  res.json(rules);
});

const updateRule = asyncHandler(async (req, res) => {
  const rule = await DeviceRule.findOneAndUpdate(
    { _id: req.params.id, farmer: req.user._id },
    req.body,
    { new: true }
  );

  if (!rule) {
    return res.status(404).json({ message: "Rule not found" });
  }

  res.json(rule);
});

const manualControl = asyncHandler(async (req, res) => {
  const action = String(req.body.action || "").trim().toUpperCase();
  const device = String(req.body.device || "").trim();

  if (!device || !["ON", "OFF"].includes(action)) {
    return res.status(400).json({ message: "Valid device and action are required" });
  }

  const command = await DeviceCommand.create({
    farmer: req.user._id,
    device,
    action,
    source: "manual",
    deviceId: req.body.deviceId || "esp32-main"
  });

  res.json({
    message: "Manual control command queued",
    command
  });
});

module.exports = {
  createRule,
  getRules,
  updateRule,
  manualControl
};
