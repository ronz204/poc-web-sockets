import { Elysia } from "elysia";
import { AccessPlugin } from "@auth/access/access.plugin";

export const SandboxPlugin = new Elysia({ name: "sandbox.plugin" })
  .use(AccessPlugin)
  .get("/sandbox", ({ status }) => {
    return status(200, "Sandbox is working!");
  }, {
    withAuth: ["system:admin"],
  });
