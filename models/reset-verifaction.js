const mongoose = require("mongoose");
const createAccountVerificatioSchema = new mongoose.Schema({
  resetCode: String,
  resetReferenceCode: String,
  email: String
});

module.exports = mongoose.model(
  "reset-verification",
  createAccountVerificatioSchema
);
