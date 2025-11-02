const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  to: { type: String, required: true }, // email or mobile
  code: { type: String, required: true },
  type: { type: String, enum: ["email","sms"], required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // expire by TTL if supported

module.exports = mongoose.model("OTP", otpSchema);
