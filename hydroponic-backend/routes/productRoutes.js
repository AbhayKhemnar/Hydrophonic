const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, allowRoles("farmer"), createProduct);
router.put("/:id", authMiddleware, allowRoles("farmer"), updateProduct);
router.delete("/:id", authMiddleware, allowRoles("farmer"), deleteProduct);

module.exports = router;
