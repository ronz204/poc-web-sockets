import { Elysia, type ElysiaConfig } from "elysia";

const config: ElysiaConfig<"/user"> = {
  prefix: "/user", name: "user-router"
};

export const UserRouter = new Elysia(config)
  .get("/health", () => ({ status: "healthy" }));
