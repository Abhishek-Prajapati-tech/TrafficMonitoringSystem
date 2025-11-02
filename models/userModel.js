const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  mobile: { type: String, unique: true, sparse: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
