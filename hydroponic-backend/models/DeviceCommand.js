const mongoose = require("mongoose");

const deviceCommandSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    device: {
      type: String,
      enum: ["relay1", "relay2", "pump", "fogger", "fan"],
      required: true
    },
    action: {
      type: String,
      enum: ["ON", "OFF"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "executed"],
      default: "pending"
    },
    source: {
      type: String,
      enum: ["manual", "automation"],
      default: "manual"
    },
    deviceId: {
      type: String,
      default: "esp32-main"
    },
    issuedAt: {
      type: Date,
      default: Date.now
    },
    executedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("DeviceCommand", deviceCommandSchema);
