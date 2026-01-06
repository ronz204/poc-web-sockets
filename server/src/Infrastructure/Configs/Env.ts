import * as z from "zod";

const envSchema = z.object({
  ALLOWED_ORIGINS: z.string().min(1),
});

export const Env = envSchema.parse(process.env);
