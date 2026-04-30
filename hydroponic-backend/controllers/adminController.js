const User = require("../models/User");
const Complaint = require("../models/Complaint");
const Subscription = require("../models/Subscription");
const Product = require("../models/Product");
const Bid = require("../models/Bid");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");

const getUsers = asyncHandler(async (req, res) => {
  const filter = req.query.role ? { role: req.query.role } : {};
  const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

const getComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });
  res.json(complaints);
});

const updateComplaintStatus = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      adminRemark: req.body.adminRemark
    },
    { new: true }
  );

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  res.json(complaint);
});

const getSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find()
    .populate("trader", "name email")
    .sort({ createdAt: -1 });
  res.json(subscriptions);
});

const updateSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);
  if (!subscription) {
    return res.status(404).json({ message: "Subscription not found" });
  }

  subscription.status = req.body.status || subscription.status;
  await subscription.save();

  await User.findByIdAndUpdate(subscription.trader, {
    subscriptionStatus:
      subscription.status === "approved"
        ? "active"
        : subscription.status === "pending"
          ? "pending"
          : "rejected"
  });

  res.json(subscription);
});

const getMarketplaceOverview = asyncHandler(async (req, res) => {
  const [products, bids, orders, openComplaints] = await Promise.all([
    Product.countDocuments(),
    Bid.countDocuments(),
    Order.countDocuments(),
    Complaint.countDocuments({ status: { $ne: "resolved" } })
  ]);

  res.json({
    products,
    bids,
    orders,
    openComplaints
  });
});

module.exports = {
  getUsers,
  getComplaints,
  updateComplaintStatus,
  getSubscriptions,
  updateSubscription,
  getMarketplaceOverview
};
