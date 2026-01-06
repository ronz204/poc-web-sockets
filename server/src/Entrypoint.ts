import express from "express";
import { Bootstrap } from "./Bootstrap";

const app = express();
const bootstrap = new Bootstrap(app);

bootstrap.addCors();
bootstrap.addRouting();

bootstrap.listen();


/* const socket = new Server(server, {
  cors: CorsConfig
}); */

/* const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

expr.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
}); */


/* socket.on("connection", (io) => {
  console.log("a user connected", io.id);

  io.on("send-message", (message: string) => {
    console.log(`Message from ${io.id}: ${message}`);
    io.broadcast.emit("receive-message", message);
  });

  io.on("disconnect", () => {
    console.log("user disconnected", io.id);
  });
}); */

