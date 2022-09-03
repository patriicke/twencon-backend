const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;
const server = require("http").createServer(app);
const cors = require("cors");
require("dotenv").config();
const User = require("./models/Users");
const Message = require("./models/Messages");
const rooms = ["general", "tech", "finance", "crypto"];
const userRoutes = require("./routes/userRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const homeRoutes = require("./routes/homeRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const corsOptions = require("./config/cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use("/auth", userRoutes);
app.use("/verification", verificationRoutes);
app.use("/home", homeRoutes);
app.use("/notifications", notificationRoutes);
require("./config/connection");
const io = require("socket.io")(server, {
  cors: corsOptions
});
app.get("/rooms", (req, res) => {
  res.json(rooms);
});
async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } }
  ]);
  return roomMessages;
}
function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");
    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];
    return date1 < date2 ? -1 : 1;
  });
}

//socket connections

io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });

  socket.on("join-room", async (currentRoom, previousRoom) => {
    socket.join(currentRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(currentRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    //send message to room
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);

    if (room.length > 10) {
      const receiver = room.split("-").filter((data) => {
        return data !== sender._id;
      })[0];
      const user = await User.findById(receiver);
      if (user.newMessages[room]) {
        await User.updateOne(
          { email: user.email },
          {
            $set: {
              newMessages: {
                ...user.newMessages,
                [room]: user.newMessages[room] + 1
              }
            }
          }
        );
      } else {
        await User.updateOne(
          { email: user.email },
          {
            $set: { newMessages: { ...user.newMessages, [room]: 1 } }
          }
        );
      }
    } else {
      await (
        await User.find()
      ).forEach(async (item) => {
        const current = item.newMessages[room];
        if (item.email !== sender.email)
          if (current) {
            await User.updateOne(
              { email: item.email },
              {
                $set: {
                  newMessages: {
                    ...item.newMessages,
                    [room]: item.newMessages[room] + 1
                  }
                }
              }
            );
          } else {
            await User.updateOne(
              { email: item.email },
              {
                $set: {
                  newMessages: { ...item.newMessages, [room]: 1 }
                }
              }
            );
          }
      });
    }
  });

  app.delete("/logout", async (req, res) => {
    try {
      const { _id, newMessages } = req.body;
      const user = await User.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      const members = await User.find();
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Invalid endpoint" });
});
server.listen(PORT, () => {
  console.log(`Server is running on localhost:`, PORT);
});
