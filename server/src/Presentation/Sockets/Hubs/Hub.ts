import type { Server, Socket } from "socket.io";

export abstract class Hub {
  protected abstract readonly namespace: string;
  constructor(protected readonly io: Server) {};

  protected initialize(): void {
    this.io.of(this.namespace).on("connection", (socket: Socket) => {
      this.onConnection(socket); this.bindEvents(socket);
      socket.on("disconnect", () => this.onDisconnect(socket));
    });
  };

  protected abstract bindEvents(socket: Socket): void;

  protected onConnection(socket: Socket): void {
    console.log(`a user connected to /${this.namespace}`, socket.id);
  };

  protected onDisconnect(socket: Socket): void {
    console.log(`user disconnected from /${this.namespace}`, socket.id);
  };
};
