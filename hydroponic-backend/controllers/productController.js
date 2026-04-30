const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    farmer: req.user._id
  });

  res.status(201).json(product);
});

const getProducts = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.saleType) filter.saleType = req.query.saleType;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.farmer) filter.farmer = req.query.farmer;

  const products = await Product.find(filter)
    .populate("farmer", "name location contact")
    .sort({ createdAt: -1 });

  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("farmer", "name location contact");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, farmer: req.user._id },
    req.body,
    { new: true }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    farmer: req.user._id
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product deleted" });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
