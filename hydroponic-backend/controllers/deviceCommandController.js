const DeviceCommand = require("../models/DeviceCommand");
const asyncHandler = require("../utils/asyncHandler");

const normalizeAction = (action) => String(action || "").trim().toUpperCase();

const createDeviceCommand = asyncHandler(async (req, res) => {
  const action = normalizeAction(req.body.action);
  const device = String(req.body.device || "").trim();

  if (!device || !["ON", "OFF"].includes(action)) {
    return res.status(400).json({ message: "Valid device and action are required" });
  }

  await DeviceCommand.updateMany(
    {
      farmer: req.user._id,
      device,
      status: "pending"
    },
    {
      status: "executed",
      executedAt: new Date()
    }
  );

  const command = await DeviceCommand.create({
    farmer: req.user._id,
    device,
    action,
    source: req.body.source || "manual",
    deviceId: req.body.deviceId || "esp32-main"
  });

  res.status(201).json({
    message: "Device command queued successfully",
    data: command
  });
});

const getFarmerCommands = asyncHandler(async (req, res) => {
  const commands = await DeviceCommand.find({ farmer: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(commands);
});

const getLatestDeviceCommand = asyncHandler(async (req, res) => {
  const command = await DeviceCommand.findOne({
    farmer: req.params.farmerId,
    deviceId: req.query.deviceId || "esp32-main",
    status: "pending"
  }).sort({ createdAt: -1 });

  if (!command) {
    return res.json({
      hasCommand: false
    });
  }

  res.json({
    hasCommand: true,
    command
  });
});

const markCommandExecuted = asyncHandler(async (req, res) => {
  const command = await DeviceCommand.findByIdAndUpdate(
    req.params.id,
    {
      status: "executed",
      executedAt: new Date()
    },
    { new: true }
  );

  if (!command) {
    return res.status(404).json({ message: "Command not found" });
  }

  res.json({
    message: "Command marked as executed",
    data: command
  });
});

module.exports = {
  createDeviceCommand,
  getFarmerCommands,
  getLatestDeviceCommand,
  markCommandExecuted
};
