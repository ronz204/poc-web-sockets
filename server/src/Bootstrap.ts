import Elysia from "elysia";
import cors from "@elysiajs/cors";

// ==== Routers ====
import { AuthRouter } from "@Routers/AuthRouter";
import { SocketRouter } from "@Routers/SocketRouter";

// ==== Plugins ====
import { LoggingPlugin } from "@Plugins/LoggingPlugin";

const addCors = (app: Elysia) => {
  return app.use(cors({ origin: "*" }));
};

const addRouters = (app: Elysia) => {
  return app
    .use(AuthRouter)
    .use(SocketRouter);
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
