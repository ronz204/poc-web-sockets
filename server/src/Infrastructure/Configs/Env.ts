import * as z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1),
  ALLOWED_ORIGINS: z.string().min(1),
});

export const Env = envSchema.parse(process.env);
