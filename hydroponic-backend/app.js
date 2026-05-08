const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/bids", require("./routes/bidRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));
app.use("/api/sensor", require("./routes/sensorRoutes"));
app.use("/api/sensor-data", require("./routes/sensorDataRoutes"));
app.use("/api/rules", require("./routes/ruleRoutes"));
app.use("/api/images", require("./routes/imageRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(errorMiddleware);

module.exports = app;
