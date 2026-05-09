import { env } from "@env";
import { Elysia } from "elysia";
import { CorsPlugin } from "@plugins/cors.plugin";
import { ScalarPlugin } from "@plugins/scalar.plugin";
import { SandboxPlugin } from "@sandbox/sandbox.plugin";
import { IdentityPlugin } from "@features/identiy/plugin";

export const app = new Elysia({ prefix: "/api" })
  .use(CorsPlugin)
  .use(ScalarPlugin)
  .use(SandboxPlugin)
  .use(IdentityPlugin)
  .listen(env.APP_PORT);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
