import Elysia from "elysia";
import cors from "@elysiajs/cors";

// ==== Routers ====
import { AuthRouter } from "@Routers/AuthRouter";
import { ChatRouter } from "@Routers/ChatRouter";

// ==== Plugins ====
import { LoggingPlugin } from "@Plugins/LoggingPlugin";

const addCors = (app: Elysia) => {
  return app.use(cors({ origin: "*" }));
};

const addRouters = (app: Elysia) => {
  return app
    .use(AuthRouter)
    .use(ChatRouter);
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
