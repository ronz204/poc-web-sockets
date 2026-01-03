import { io } from "socket.io-client";

const URL = "http://localhost:3000";

export const Socket = io(URL, {
  autoConnect: false,
});
