const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  createRule,
  getRules,
  updateRule,
  manualControl
} = require("../controllers/ruleController");

const router = express.Router();

router.use(authMiddleware, allowRoles("farmer"));
router.post("/", createRule);
router.get("/", getRules);
router.put("/:id", updateRule);
router.post("/manual-control", manualControl);

module.exports = router;
