const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Can't be blank"]
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Invalid email"]
    },
    password: {
      type: String,
      required: [true, "Can't be blank"]
    },
    picture: {
      type: String
    },
    newMessages: {
      type: Object
    },
    status: {
      type: String,
      default: "online"
    }
  },
  {
    minimize: false
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
