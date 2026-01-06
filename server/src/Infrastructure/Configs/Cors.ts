import type { CorsOptions } from "cors";
import { Env } from "./Env";

const getAllowedOrigins = (): string[] => {
  return Env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim());
};

export const CorsConfig: CorsOptions = {
  credentials: true,
  origin: getAllowedOrigins(),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
};
