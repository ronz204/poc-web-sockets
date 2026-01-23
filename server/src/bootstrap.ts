import Elysia from "elysia";
import cors from "@elysiajs/cors";
import { LoggingMiddleware } from "@Middlewares/logging";
import { AuthController } from "@Controllers/auth-controller";
import { UserController } from "@Controllers/user-controller";
import { ChatController } from "@Controllers/chat-controller";

const Cors = (app: Elysia) => {
  return app.use(cors({ origin: "*" }));
};

const HealthCheck = (app: Elysia) => {
  return app.get("/health", () => ({ status: "healthy" }));
};

const Controllers = (app: Elysia) => {
  return app
    .use(AuthController)
    .use(UserController)
    .use(ChatController);
};

const Middlewares = (app: Elysia) => {
  return app
    .use(LoggingMiddleware);
};

export const Bootstrap = (app: Elysia) => {
  return app
    .use(Cors)
    .use(Middlewares)
    .use(HealthCheck)
    .use(Controllers);
};
