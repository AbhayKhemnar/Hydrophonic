const Complaint = require("../models/Complaint");
const asyncHandler = require("../utils/asyncHandler");

const createComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.create({
    user: req.user._id,
    subject: req.body.subject,
    message: req.body.message
  });

  res.status(201).json(complaint);
});

const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(complaints);
});

module.exports = {
  createComplaint,
  getMyComplaints
};
