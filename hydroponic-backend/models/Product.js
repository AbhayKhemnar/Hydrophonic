const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      default: "kg"
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    saleType: {
      type: String,
      enum: ["fixed", "auction"],
      required: true
    },
    auctionEndAt: Date,
    minBidAmount: {
      type: Number,
      min: 0
    },
    imageUrls: [String],
    status: {
      type: String,
      enum: ["active", "sold", "closed"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);
