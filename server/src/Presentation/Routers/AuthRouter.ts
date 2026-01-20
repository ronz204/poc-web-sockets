import { Elysia, type ElysiaConfig } from "elysia";

const config: ElysiaConfig<"/auth"> = {
  prefix: "/auth", name: "auth-router"
};

export const AuthRouter = new Elysia(config)
  .get("/health", () => ({ status: "healthy" }));
