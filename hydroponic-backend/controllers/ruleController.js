const DeviceRule = require("../models/DeviceRule");
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
  res.json({
    message: "Manual control command prepared",
    command: {
      farmer: req.user._id,
      device: req.body.device,
      action: req.body.action,
      mode: "manual"
    }
  });
});

module.exports = {
  createRule,
  getRules,
  updateRule,
  manualControl
};
