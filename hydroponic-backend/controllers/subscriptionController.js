const Subscription = require("../models/Subscription");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const requestSubscription = asyncHandler(async (req, res) => {
  const existing = await Subscription.findOne({
    trader: req.user._id,
    status: { $in: ["pending", "approved"] }
  });

  if (existing) {
    return res.status(409).json({ message: "Subscription request already exists" });
  }

  const subscription = await Subscription.create({
    trader: req.user._id,
    planName: req.body.planName || "Trader Basic"
  });

  await User.findByIdAndUpdate(req.user._id, { subscriptionStatus: "pending" });

  res.status(201).json(subscription);
});

const getMySubscription = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ trader: req.user._id }).sort({ createdAt: -1 });
  res.json(subscriptions);
});

module.exports = {
  requestSubscription,
  getMySubscription
};
