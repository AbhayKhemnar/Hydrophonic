const mongoose = require("mongoose");

const plantImageSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    capturedAt: {
      type: Date,
      default: Date.now
    },
    aiResult: {
      condition: String,
      disease: String,
      confidence: String,
      suggestion: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("PlantImage", plantImageSchema);
