import Elysia from "elysia";
import cors from "@elysiajs/cors";

// ==== Controllers ====
import { AuthController } from "@Controllers/AuthController";

// ==== Middlewares ====
import { LoggingMiddleware } from "@Middlewares/LoggingMiddleware";

const addCors = (app: Elysia) => {
  return app.use(cors({ origin: "*" }));
};

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
    .use(addCors)
    .use(addMiddlewares)
    .use(addControllers);
};
