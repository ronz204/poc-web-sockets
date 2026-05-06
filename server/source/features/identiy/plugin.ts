import { Elysia } from "elysia";
import { AuthSignInDriver } from "./auth-signin/auth-signin.driver";
import { AuthSignUpDriver } from "./auth-signup/auth-signup.driver";

const prefix: string = "/auth";
const name: string = "auth.plugin";

export const IdentityPlugin = new Elysia({ name, prefix })
  .use(AuthSignInDriver)
  .use(AuthSignUpDriver);
