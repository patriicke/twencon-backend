const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postName: {
    type: String
  },
  postDescription: {
    type: String
  },
  from: {
    type: Object
  },
  comments: {
    type: Object
  },
  likes: {
    type: Object
  },
  share: {
    type: Object
  }
});

module.exports = mongoose.model("posts", postSchema);
