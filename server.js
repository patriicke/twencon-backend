const express = require("express");
const app = express();
const rooms = ["general", "tech", "finance", "crypto"];
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
require("./config/connection");
const server = require("http").createServer(app);
const PORT = 5001;
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"]
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on localhost:`, PORT);
});
