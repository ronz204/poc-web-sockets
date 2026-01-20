import Elysia from "elysia";

// ==== Controllers ====
import { AuthController } from "@Controllers/AuthController";

// ==== Middlewares ====
import { LoggingMiddleware } from "@Middlewares/LoggingMiddleware";

const addControllers = (app: Elysia) => {
  return app
    .use(AuthController);
};

const addMiddlewares = (app: Elysia) => {
  return app
    .use(LoggingMiddleware);
};

export const Bootstrap = (app: Elysia) => {
  return app
    .use(addMiddlewares)
    .use(addControllers);
};
