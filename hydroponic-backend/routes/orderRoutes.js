const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  createOrder,
  getMyOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const router = express.Router();

router.use(authMiddleware);
router.post("/", allowRoles("trader", "consumer"), createOrder);
router.get("/my", getMyOrders);
router.put("/:id/status", allowRoles("farmer", "admin"), updateOrderStatus);

module.exports = router;
