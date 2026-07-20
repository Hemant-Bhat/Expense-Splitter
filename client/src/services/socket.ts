import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    // path: '/chat'
    autoConnect: false,
});

export { socket };
