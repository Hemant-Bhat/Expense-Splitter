import { Server } from "socket.io";
import { parseCookie } from "cookie";
import { verifyToken } from "./middleware/auth.js";

let io = null;

export const initSocket = (server) => {
    io = new Server(server, {
        serveClient: true,
        // path: "/chat",
        cors: {
            origin: [`${process.env.CLIENT_URL}`],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        const cookieHeaders = socket.handshake.headers.cookie;

        if (!cookieHeaders) {
            return next(new Error("Unauthorized"));
        }

        const cookies = parseCookie(cookieHeaders);
        const token = cookies.token;

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        try {
            const decoded = verifyToken(token);

            // console.log(decoded);

            socket.user = decoded;
            next();
        } catch (error) {
            next(new Error("Invalid token"));
        }
    });

    registerSocketHandler(io);
};

const registerSocketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("a user:", socket.user.userId, "connected with socket:", socket.id);
        socket.join(socket.user.userId);

        socket.on("join-group", (id) => socket.join(id));
        socket.on("leave-group", (id) => socket.leave(id));

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
