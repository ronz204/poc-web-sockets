import { Elysia } from "elysia";
import { ScopePlugin } from "@security/scopes/scopes.plugin";
import { AccessPlugin } from "@security/access/access.plugin";

export const SandboxPlugin = new Elysia({ name: "sandbox.plugin" })
  .use(ScopePlugin)
  .use(AccessPlugin)  
  .get("/sandbox", ({ status, claims }) => {
    console.log(claims);
    return status(200, "Sandbox is working!");
  }, {
    hasScopes: ["system:admin"]
  });
