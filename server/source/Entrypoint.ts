import { Elysia } from "elysia";

import { AuthController } from "@Controllers/AuthController";
import { HealthController } from "@Controllers/HealthController";

const app = new Elysia()
  .use(AuthController)
  .use(HealthController)
  .listen(3000);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
