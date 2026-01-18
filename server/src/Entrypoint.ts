import { Elysia } from "elysia";
import { PingController } from "@Controllers/PingController";
import { LoggerMiddleware } from "@Middlewares/LoggerMiddleware";

const app = new Elysia()
  .use(LoggerMiddleware)
  .use(PingController)
  .listen(3000);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
