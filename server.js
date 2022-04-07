const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const users = {};

app.use(express.static(path.join(__dirname, "/")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message,
      userName: users[socket.id],
    });
  });
  socket.on("new-user", (newUser) => {
    users[socket.id] = newUser;
    socket.broadcast.emit("user-connected", newUser);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
