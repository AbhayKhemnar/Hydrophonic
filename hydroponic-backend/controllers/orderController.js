const Order = require("../models/Order");
const Product = require("../models/Product");
const Bid = require("../models/Bid");
const asyncHandler = require("../utils/asyncHandler");

const createOrder = asyncHandler(async (req, res) => {
  const { productId, quantity, bidId } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let totalPrice = quantity * product.price;
  let orderType = "fixed";

  if (product.saleType === "auction") {
    if (!bidId) {
      return res.status(400).json({ message: "Accepted bid is required for auction order" });
    }

    const bid = await Bid.findById(bidId);
    if (!bid || bid.status !== "accepted") {
      return res.status(400).json({ message: "Accepted bid not found" });
    }

    totalPrice = bid.amount;
    orderType = "auction";
  }

  const order = await Order.create({
    product: product._id,
    buyer: req.user._id,
    seller: product.farmer,
    quantity,
    totalPrice,
    orderType
  });

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    $or: [{ buyer: req.user._id }, { seller: req.user._id }]
  })
    .populate("product", "name price saleType")
    .populate("buyer", "name role")
    .populate("seller", "name role")
    .sort({ createdAt: -1 });

  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (String(order.seller) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not allowed to update this order" });
  }

  order.status = req.body.status || order.status;
  await order.save();

  res.json(order);
});

module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus
};
