const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  getUsers,
  getComplaints,
  updateComplaintStatus,
  getSubscriptions,
  updateSubscription,
  getMarketplaceOverview
} = require("../controllers/adminController");

const router = express.Router();

router.use(authMiddleware, allowRoles("admin"));

router.get("/users", getUsers);
router.get("/complaints", getComplaints);
router.put("/complaints/:id", updateComplaintStatus);
router.get("/subscriptions", getSubscriptions);
router.put("/subscriptions/:id", updateSubscription);
router.get("/marketplace-overview", getMarketplaceOverview);

module.exports = router;
