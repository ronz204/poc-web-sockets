import { Elysia, type ElysiaConfig } from "elysia";

const config: ElysiaConfig<""> = {
  name: "health-middleware",
};

export const HealthMiddleware = new Elysia(config)
  .get("/health", () => ({ status: "healthy" }));
