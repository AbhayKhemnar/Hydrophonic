const Bid = require("../models/Bid");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const resolveAuctionIfEnded = async (productId) => {
  const product = await Product.findById(productId);

  if (!product || product.saleType !== "auction" || !product.auctionEndAt) {
    return null;
  }

  const hasEnded = new Date(product.auctionEndAt).getTime() <= Date.now();
  if (!hasEnded) return null;

  const bids = await Bid.find({ product: product._id }).sort({ amount: -1, createdAt: 1 });
  if (bids.length === 0) return null;

  const highestBid = bids[0];

  if (highestBid.status !== "accepted") {
    await Bid.updateMany(
      { product: product._id, _id: { $ne: highestBid._id } },
      { $set: { status: "rejected" } }
    );

    highestBid.status = "accepted";
    await highestBid.save();
  }

  return highestBid;
};

const placeBid = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.product);

  if (!product || product.saleType !== "auction") {
    return res.status(400).json({ message: "Auction product not found" });
  }

  if (!product.auctionEndAt || new Date(product.auctionEndAt).getTime() <= Date.now()) {
    await resolveAuctionIfEnded(req.body.product);
    return res.status(400).json({ message: "This auction has already ended" });
  }

  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: "Bid amount must be a valid number" });
  }

  if (product.minBidAmount && amount < product.minBidAmount) {
    return res.status(400).json({
      message: `Bid must be at least Rs. ${product.minBidAmount}`
    });
  }

  const highestExistingBid = await Bid.findOne({ product: product._id }).sort({ amount: -1, createdAt: 1 });
  if (highestExistingBid && amount <= highestExistingBid.amount) {
    return res.status(400).json({
      message: `Bid must be higher than current highest bid Rs. ${highestExistingBid.amount}`
    });
  }

  const bid = await Bid.create({
    product: req.body.product,
    trader: req.user._id,
    amount
  });

  res.status(201).json(bid);
});

const getBidsByProduct = asyncHandler(async (req, res) => {
  await resolveAuctionIfEnded(req.params.productId);

  const bids = await Bid.find({ product: req.params.productId })
    .populate("trader", "name email contact")
    .sort({ amount: -1, createdAt: 1 });

  res.json(bids);
});

const updateBidStatus = asyncHandler(async (req, res) => {
  const bid = await Bid.findById(req.params.id).populate("product");

  if (!bid) {
    return res.status(404).json({ message: "Bid not found" });
  }

  if (String(bid.product.farmer) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not allowed to manage this bid" });
  }

  bid.status = req.body.status;
  await bid.save();

  res.json(bid);
});

module.exports = {
  placeBid,
  getBidsByProduct,
  updateBidStatus
};
