import { io, Socket } from "socket.io-client";

export class SocketService {
  private socket: Socket | null = null;

  public connect() {
    this.socket = io("http://localhost:3000/example");

    this.socket.on("receive-message", (message: string) => {
      console.log("Message received:", message);
    });
  };

  public disconnect() {
    this.socket?.disconnect();
  };

  public send(message: string) {
    this.socket?.emit("send-message", message);
  };
};
