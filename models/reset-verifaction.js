const mongoose = require("mongoose");
const createAccountVerificatioSchema = new mongoose.Schema({
  verificationCode: String,
  verificationReference: String,
  email: String,
  acc_token: String
});

module.exports = mongoose.model(
  "reset-verification",
  createAccountVerificatioSchema
);
