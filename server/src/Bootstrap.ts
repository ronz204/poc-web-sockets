import type { Express } from "express";
import http from "http";
import cors from "cors";
import { AppConfig } from "@Configs/App";
import { CorsConfig } from "@Configs/Cors";
import { AuthRouter } from "@Routers/AuthRouter";

export class Bootstrap {
  private readonly server: http.Server;

  constructor(private readonly app: Express) {
    this.server = http.createServer(app);
  };
  public addCors(): void {
    this.app.use(cors(CorsConfig));
  };

  public addRouting(): void {
    this.app.use("/api/auth", AuthRouter);
  };

  public listen(): void {
    this.server.listen(AppConfig.port, () => {
      console.log(`Server is running on http://localhost:${AppConfig.port}`);
    });
  };
};
