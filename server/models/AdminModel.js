const mongoose = require("mongoose");

const adminModel = mongoose.model("adminData", {
  type: String,
  userName: String,
  password: String,
  status: String,
  date: String,
});

module.exports = adminModel;
