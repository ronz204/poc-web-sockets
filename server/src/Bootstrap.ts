import Elysia from "elysia";
import cors from "@elysiajs/cors";
import { AuthRouter } from "@Routers/AuthRouter";
import { ChatRouter } from "@Routers/ChatRouter";
import { UserRouter } from "@Routers/UserRouter";
import { LoggingPlugin } from "@Plugins/Logging";

const addCors = (app: Elysia) => {
  return app.use(cors({ origin: "*" }));
};

const addRouters = (app: Elysia) => {
  return app
    .use(AuthRouter)
    .use(ChatRouter)
    .use(UserRouter);
};

const addPlugins = (app: Elysia) => {
  return app
    .use(LoggingPlugin);
};

export const Bootstrap = (app: Elysia) => {
  return app
    .use(addCors)
    .use(addPlugins)
    .use(addRouters);
};
