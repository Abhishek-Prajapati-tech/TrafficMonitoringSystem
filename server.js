const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const TrafficData = require("./models/trafficData");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ MongoDB connection
mongoose.connect("mongodb+srv://abhishekprajapati7470_db_user:KhxWNgVbA5glsQ7I@cluster0.pemwy9x.mongodb.net/trafficDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ API route to add data
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

// ✅ API route to fetch data
app.get("/api/traffic", async (req, res) => {
  const data = await TrafficData.find();
  res.json(data);
});

// ✅ Serve frontend (index.html)
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// ✅ Start the server

