require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const TrafficData = require("./models/trafficData");
const User = require("./models/userModel");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Email transporter for OTP / password reset
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🧠 Signup API
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, mobile, password: hashed });
    await user.save();
    res.json({ success: true, message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧠 Login via Email or Mobile
app.post("/api/login", async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }]
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧠 OTP Send API (email only)
app.post("/api/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`
    });
    res.json({ success: true, otp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧠 Traffic data routes
app.post("/api/traffic", async (req, res) => {
  try {
    const { location, vehicleCount } = req.body;
    const data = new TrafficData({ location, vehicleCount });
    await data.save();
    res.json({ success: true, message: "Data saved!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/traffic", async (req, res) => {
  const data = await TrafficData.find();
  res.json(data);
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
