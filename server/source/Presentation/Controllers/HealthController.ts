import { Elysia, type ElysiaConfig } from "elysia";

const config: ElysiaConfig<"/health"> = {
  prefix: "/health", name: "health-controller",
};

export const HealthController = new Elysia(config)
  .get("/", () => ({ status: "healthy" }));
