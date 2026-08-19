import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BASE_URI, {
    // path: '/chat'
    autoConnect: false,
    withCredentials: true,
});

socket.on("connect", () => {
    // console.log("Socket connected");
});

export { socket };
