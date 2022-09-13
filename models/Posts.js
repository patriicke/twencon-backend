const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    post: {
      type: Object
    },
    owner: {
      type: Object
    },
    comments: {
      type: Array,
      default: []
    },
    likes: {
      type: Array,
      default: []
    },
    share: {
      type: Array,
      default: []
    },
    date: {
      type: Date
    }
  },
  {
    minimize: false
  }
);

module.exports = mongoose.model("posts", postSchema);
