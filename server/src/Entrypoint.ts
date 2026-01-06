import http from "http";
import cors from "cors";
import winston from "winston";
import express from "express";
import { Server } from "socket.io";
import { AppConfig } from "@Configs/App";
import { CorsConfig } from "@Configs/Cors";
import { AuthRouter } from "@Routers/AuthRouter";

const expr = express();
const server = http.createServer(expr);

expr.use(cors(CorsConfig));

const socket = new Server(server, {
  cors: CorsConfig
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

expr.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

expr.use("/api/auth", AuthRouter);

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

server.listen(AppConfig.port, () => {
  console.log(`Server is running on http://localhost:${AppConfig.port}`);
});
