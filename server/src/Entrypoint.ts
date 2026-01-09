import express from "express";
import { Bootstrap } from "./Bootstrap";

const app = express();
const bootstrap = new Bootstrap(app);

bootstrap.addCors();
bootstrap.addRouting();
bootstrap.addSockets();
bootstrap.addMiddlewares();

bootstrap.listen();


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

