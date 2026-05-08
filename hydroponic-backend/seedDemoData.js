require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
const Bid = require("./models/Bid");
const Order = require("./models/Order");
const Complaint = require("./models/Complaint");
const Subscription = require("./models/Subscription");
const SensorData = require("./models/SensorData");
const Alert = require("./models/Alert");

const demoUsers = [
  {
    name: "Admin User",
    email: "admin@hydroponic.com",
    password: "Admin@123",
    role: "admin",
    location: { state: "Maharashtra", district: "Pune", village: "Head Office" },
    contact: { phone: "9000000001" }
  },
  {
    name: "Farmer Abhay",
    email: "farmer1@hydroponic.com",
    password: "Farmer@123",
    role: "farmer",
    location: { state: "Maharashtra", district: "Ahmednagar", village: "Ambhore" },
    contact: { phone: "9000000002" }
  },
  {
    name: "Farmer Sita",
    email: "farmer2@hydroponic.com",
    password: "Farmer@123",
    role: "farmer",
    location: { state: "Maharashtra", district: "Nashik", village: "Sinnar" },
    contact: { phone: "9000000003" }
  },
  {
    name: "Trader Rahul",
    email: "trader@hydroponic.com",
    password: "Trader@123",
    role: "trader",
    location: { state: "Maharashtra", district: "Mumbai", village: "Vashi" },
    contact: { phone: "9000000004" },
    subscriptionStatus: "active"
  },
  {
    name: "Consumer Neha",
    email: "consumer@hydroponic.com",
    password: "Consumer@123",
    role: "consumer",
    location: { state: "Maharashtra", district: "Pune", village: "Kothrud" },
    contact: { phone: "9000000005" }
  }
];

async function upsertUser(userData) {
  const existing = await User.findOne({ email: userData.email });
  if (existing) return existing;
  return User.create(userData);
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const users = {};
  for (const userData of demoUsers) {
    const user = await upsertUser(userData);
    users[user.email] = user;
  }

  const farmer1 = users["farmer1@hydroponic.com"];
  const farmer2 = users["farmer2@hydroponic.com"];
  const trader = users["trader@hydroponic.com"];
  const consumer = users["consumer@hydroponic.com"];

  const productSeeds = [
    {
      farmer: farmer1._id,
      name: "Premium Lettuce",
      description: "Fresh hydroponic lettuce for direct sale.",
      quantity: 40,
      price: 120,
      saleType: "fixed",
      status: "active"
    },
    {
      farmer: farmer1._id,
      name: "Cherry Tomato Batch",
      description: "Auction lot for traders and bulk buyers.",
      quantity: 75,
      price: 160,
      saleType: "auction",
      minBidAmount: 11000,
      auctionEndAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: "active"
    },
    {
      farmer: farmer2._id,
      name: "Spinach Greens",
      description: "Daily harvest available for local consumers.",
      quantity: 30,
      price: 90,
      saleType: "fixed",
      status: "active"
    }
  ];

  const products = [];
  for (const seedProduct of productSeeds) {
    let product = await Product.findOne({
      farmer: seedProduct.farmer,
      name: seedProduct.name
    });

    if (!product) {
      product = await Product.create(seedProduct);
    }

    products.push(product);
  }

  const auctionProduct = products.find((product) => product.saleType === "auction");
  if (auctionProduct) {
    const existingBid = await Bid.findOne({
      product: auctionProduct._id,
      trader: trader._id
    });

    if (!existingBid) {
      await Bid.create({
        product: auctionProduct._id,
        trader: trader._id,
        amount: 12500,
        status: "pending"
      });
    }
  }

  const fixedProduct = products.find((product) => product.name === "Premium Lettuce");
  if (fixedProduct) {
    const existingOrder = await Order.findOne({
      product: fixedProduct._id,
      buyer: consumer._id
    });

    if (!existingOrder) {
      await Order.create({
        product: fixedProduct._id,
        buyer: consumer._id,
        seller: farmer1._id,
        quantity: 5,
        totalPrice: 600,
        orderType: "fixed",
        status: "pending"
      });
    }
  }

  const existingComplaint = await Complaint.findOne({
    subject: "Delayed subscription approval",
    user: trader._id
  });

  if (!existingComplaint) {
    await Complaint.create({
      user: trader._id,
      subject: "Delayed subscription approval",
      message: "Please review my trader subscription quickly.",
      status: "open"
    });
  }

  const existingSubscription = await Subscription.findOne({ trader: trader._id });
  if (!existingSubscription) {
    await Subscription.create({
      trader: trader._id,
      planName: "Trader Basic",
      status: "approved"
    });
  }

  const sensorExists = await SensorData.findOne({ farmer: farmer1._id });
  if (!sensorExists) {
    await SensorData.create({
      farmer: farmer1._id,
      deviceId: "ESP32-DEMO-01",
      farmName: "Abhay Hydro Farm",
      ph: 6.1,
      tds: 820,
      temperature: 24.5,
      humidity: 68,
      waterLevel: 72
    });
  }

  const alertExists = await Alert.findOne({ farmer: farmer1._id, type: "waterLevel" });
  if (!alertExists) {
    await Alert.create({
      farmer: farmer1._id,
      type: "waterLevel",
      message: "Demo alert: water level dropped below preferred range.",
      severity: "medium"
    });
  }

  console.log("Demo data ready.");
  console.log("Admin login: admin@hydroponic.com / Admin@123");
  console.log("Farmer login: farmer1@hydroponic.com / Farmer@123");
  console.log("Trader login: trader@hydroponic.com / Trader@123");
  console.log("Consumer login: consumer@hydroponic.com / Consumer@123");

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Failed to seed demo data", error);
  await mongoose.disconnect();
  process.exit(1);
});
