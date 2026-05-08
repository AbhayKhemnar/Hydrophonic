const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  placeBid,
  getBidsByProduct,
  updateBidStatus
} = require("../controllers/bidController");

const router = express.Router();

router.get("/product/:productId", authMiddleware, getBidsByProduct);
router.post("/", authMiddleware, allowRoles("trader"), placeBid);
router.put("/:id/status", authMiddleware, allowRoles("farmer"), updateBidStatus);

module.exports = router;
