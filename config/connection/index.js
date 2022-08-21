const mongoose = require("mongoose");
const connectDb = mongoose
  .connect("mongodb://localhost/chat")
  .then(() => {
    console.log(`Database connected`);
  })
  .catch(() => {
    console.log(`Database failed to connect`);
  });

module.exports = connectDb;
