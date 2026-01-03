import http from "http";
import express from "express";
import { Server } from "socket.io";

const expr = express();
const server = http.createServer(expr);

const socket = new Server(server, {
  cors: { origin: "*" }
});

expr.get("/", (req, res) => {
  console.log(req.ip);

  res.status(200).json({
    message: "Hello World!",
  });
});

socket.on("connection", (io) => {
  console.log("a user connected", io.id);

  io.on("send-message", (message: string) => {
    console.log(`Message from ${io.id}: ${message}`);
    io.broadcast.emit("receive-message", message);
  });

  io.on("disconnect", () => {
    console.log("user disconnected", io.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
