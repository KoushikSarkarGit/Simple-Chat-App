const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
const socketio = require("socket.io");

const app = express();
app.use(cors());

const myserver = createServer(app);
const io = new socketio.Server(myserver, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", async (cursocket) => {
  let croom = "global";
  await cursocket.join(croom);

  cursocket.on("join-room", (req) => {
    cursocket.leave(croom);
    cursocket.join(req.room);
    croom = req.room;

    cursocket.to(croom).emit("join-room", {
      message: `User ${req.username} with id ${cursocket.id} has joined the room: ${req.room}`,
      socketid: cursocket.id,
      type: "info",
      username: req.username,
      time: req.time,
      room: req.room,
    });
    cursocket.emit("join-room", {
      message: `You joined the room: ${req.room}`,
      socketid: cursocket.id,
      type: "info",
      username: req.username,
      time: req.time,
      room: req.room,
    });
  });

  //leave room handler

  cursocket.on("leave-room", (req) => {
    cursocket.to(croom).emit("leave-room", {
      message: `User ${req.username} with id ${cursocket.id} has left the room: ${req.room}`,
      socketid: cursocket.id,
      type: "info",
      username: req.username,
      time: req.time,
      room: req.room,
    });

    cursocket.emit("leave-room", {
      message: `You left the room: ${req.room}`,
      socketid: cursocket.id,
      type: "info",
      username: req.username,
      time: req.time,
      room: req.room,
    });

    cursocket.leave(req.room);
    cursocket.join("global");
    croom = "global";
  });

  cursocket.on("message", (req) => {
    croom = req.room;
    console.log(req.message);
    cursocket.emit("message", {
      message: req.message,
      socketid: cursocket.id,
      type: "message",
      username: req.username,
      time: req.time,
      room: req.room,
    });
    cursocket.to(croom).emit("message", {
      message: req.message,
      socketid: cursocket.id,
      type: "message",
      username: req.username,
      time: req.time,
      room: req.room,
    });
  });

  cursocket.on("disconnect", (req) => {
    croom = req.room;
    cursocket.to(croom).emit("leave-room", {
      message: `User ${req.username} with id ${cursocket.id} has been disconnected from room: ${req.room}`,
      socketid: cursocket.id,
      type: "info",
      username: req.username,
      time: req.time,
      room: req.room,
    });
    cursocket.leave(req.room);
  });
});

app.get("/", (req, res) => {
  res.send("Server is up and running");
  console.log("base");
});

myserver.listen(9000, () => {
  console.log("Server is running on port 9000");
});
