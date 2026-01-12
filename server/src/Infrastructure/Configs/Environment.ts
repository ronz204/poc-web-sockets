import * as z from "zod";

const envSchema = z.object({
  // App configs
  PORT: z.coerce.number().int().min(1),

  // CORS configs
  ALLOWED_ORIGINS: z.string().min(1),

  // Database configs
  POSTGRES_DB: z.string().min(1),
  POSTGRES_URL: z.string().min(1),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
});

export const Environment = envSchema.parse(process.env);
