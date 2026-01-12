import type { CorsOptions } from "cors";
import { Environment } from "./Environment";

const getAllowedOrigins = (): string[] => {
  return Environment.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim());
};

export const CorsConfig: CorsOptions = {
  credentials: true,
  origin: getAllowedOrigins(),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
};
