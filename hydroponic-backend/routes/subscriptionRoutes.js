const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  requestSubscription,
  getMySubscription
} = require("../controllers/subscriptionController");

const router = express.Router();

router.use(authMiddleware, allowRoles("trader"));
router.post("/", requestSubscription);
router.get("/my", getMySubscription);

module.exports = router;
