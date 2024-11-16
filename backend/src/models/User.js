const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, default: null },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Customer", "Partner"],
    required: true,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
