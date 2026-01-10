import express from "express";
import { Bootstrap } from "./Bootstrap";

const app = express();
const bootstrap = new Bootstrap(app);

bootstrap.addCors();
bootstrap.addRouting();
bootstrap.addSockets();

bootstrap.listen();
