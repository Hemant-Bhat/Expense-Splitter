import { Server } from "socket.io";

let io = null;

export const initSocket = (server) => {
    io = new Server(server, {
        serveClient: true,
        // path: "/chat",
        cors: {
            origin: ["http://localhost:5173"],
            methods: ["GET", "POST"],
        },
    });

    registerSocketHandler(io);
};

const registerSocketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("a user connected", socket.id);

        socket.on("join-room", (id) => socket.join(id));
        socket.on("leave-room", (id) => socket.leave(id));

        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id);
        });
    });
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket Io not initialized!");
    }

    return io;
};
// socket.on("chat message", (msg, roomId) => {
//     console.log("message: " + msg);

//     io.emit("chat message", msg);
//     // socket.broadcast.emit("member:updated", msg);
//     socket.to(roomId).emit("member:updated", msg);
// });
