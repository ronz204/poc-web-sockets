import Elysia from "elysia";

export const LoggerMiddleware = new Elysia({ name: "logger" })
  .onRequest(({ request }) => {
    console.log(`Request: ${request.method} ${new URL(request.url).pathname}`);
  }).onAfterResponse({ as: "global" }, ({ request }) => {
    console.log(`Response: ${request.method} ${new URL(request.url).pathname}`);
  });
