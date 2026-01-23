import { Elysia, type ElysiaConfig } from "elysia";

const config: ElysiaConfig<""> = {
  name: "logging-middleware"
};

export const LoggingMiddleware = new Elysia(config)
  .onRequest(() => {
    console.log("Request received");
  })
  .onAfterResponse({ as: "global" }, () => {
    console.log("Response sent");
  });
