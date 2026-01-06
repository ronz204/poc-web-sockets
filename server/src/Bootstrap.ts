import type { Express } from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { AppConfig } from "@Configs/App";
import { CorsConfig } from "@Configs/Cors";
import { AuthRouter } from "@Routers/AuthRouter";

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
    this.app.use("/api/auth", AuthRouter);
  };

  public addSockets(): void {
    this.socket.on("connection", (io) => {
      console.log("a user connected", io.id);

      io.on("send-message", (message: string) => {
        console.log(`Message from ${io.id}: ${message}`);
        io.broadcast.emit("receive-message", message);
      });

      io.on("disconnect", () => {
        console.log("user disconnected", io.id);
      });
    });
  };

  public listen(): void {
    this.server.listen(AppConfig.port, () => {
      console.log(`Server is running on http://localhost:${AppConfig.port}`);
    });
  };
};
