const mongoose = require("mongoose");
require("dotenv").config();
const connectDb = mongoose
  .connect(process.env.PRODUCTION ? process.env.DB_HOST : process.env.DB_URL)
  .then(() => {
    console.log(`Database connected`);
  })
  .catch(() => {
    console.log(`Database failed to connect`);
  });

module.exports = connectDb;
