const mongoose = require("mongoose");

const trafficSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  vehicleCount: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("TrafficData", trafficSchema);

