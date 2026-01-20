import { Elysia } from "elysia";
import { AuthController } from "@Controllers/AuthController";
import { LoggingMiddleware } from "@Middlewares/LoggingMiddleware";

const app = new Elysia()
  .use(AuthController)
  .use(LoggingMiddleware)
  .listen(3000);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
