const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full Name can't be empty"]
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Email can't be empty"],
      validate: [isEmail, "Try using a valid email please"],
      index: true
    },
    username: {
      type: String,
      required: [true, "Username can't be empty"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "Password can't be empty"]
    },
    profile: {
      type: String,
      default: "icon"
    },
    newMessages: {
      type: Object,
      default: {}
    },
    status: {
      type: String,
      default: "online"
    },
    telephone: {
      type: String,
      required: [true, "Telephone can't be empty"],
      unique: true
    },
    refreshToken: {
      type: String
    },
    following: {
      type: Array,
      default: []
    },
    followers: {
      type: Array,
      default: []
    }
  },
  {
    minimize: false
  }
);

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  return userObject;
};

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error(`Invalid email or password!`);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error(`Invalid email or password`);
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
