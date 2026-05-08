const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    deviceId: String,
    farmName: String,
    ph: {
      type: Number,
      required: true,
      min: 0,
      max: 14
    },
    tds: {
      type: Number,
      required: true,
      min: 0
    },
    temperature: {
      type: Number,
      required: true
    },
    humidity: {
      type: Number,
      default: 0
    },
    waterLevel: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("SensorData", sensorSchema);
