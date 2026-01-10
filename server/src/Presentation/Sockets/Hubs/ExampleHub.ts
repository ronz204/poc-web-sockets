import type { Server, Socket } from "socket.io";
import { BaseHub } from "./BaseHub";

export class ExampleHub extends BaseHub {
  protected readonly namespace: string = "/example";

  constructor(io: Server) {
    super(io); this.initialize();
  };

  protected bindEvents(socket: Socket): void {
    socket.on("send-message", (message: string) => this.onMessage(socket, message));
  };

  private onMessage(socket: Socket, message: string): void {
    console.log(`Message from ${socket.id} on /example: ${message}`);
    socket.broadcast.emit("receive-message", message);
  };
};
