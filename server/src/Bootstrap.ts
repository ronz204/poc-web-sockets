import type { Express } from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { AppConfig } from "@Configs/App";
import { CorsConfig } from "@Configs/Cors";
import { ExampleHub } from "@Hubs/ExampleHub";
import { ApiRouting } from "@Routers/ApiRouting";

export class Bootstrap {
  private readonly socket: Server;
  private readonly server: http.Server;

  constructor(private readonly app: Express) {
    this.server = http.createServer(app);

    this.socket = new Server(this.server, {
      cors: CorsConfig
    });
  };

  public addCors(): void {
    this.app.use(cors(CorsConfig));
  };

  public addRouting(): void {
    this.app.use("/api", ApiRouting);
  };

  public addSockets(): void {
    new ExampleHub(this.socket);
  };

  public listen(): void {
    this.server.listen(AppConfig.port, () => {
      console.log(`Server is running on http://localhost:${AppConfig.port}`);
    });
  };
};
