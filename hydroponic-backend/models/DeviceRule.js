const mongoose = require("mongoose");

const deviceRuleSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    ruleName: {
      type: String,
      required: true
    },
    parameter: {
      type: String,
      enum: ["ph", "tds", "temperature", "humidity", "waterLevel"],
      required: true
    },
    device: {
      type: String,
      enum: ["pump", "fogger", "fan"],
      required: true
    },
    comparison: {
      type: String,
      enum: ["lt", "gt"],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    action: {
      type: String,
      enum: ["on", "off"],
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("DeviceRule", deviceRuleSchema);
