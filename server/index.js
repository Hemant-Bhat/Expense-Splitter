import e from "express";
// console.log("HELWPWPWP");
import { connectDb } from "./db.js";
import env from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createServer } from "node:http";
import { Server } from "socket.io";

// import "./socket.js";
import { authRouter } from "./routes/auth.js";
import { groupRouter } from "./routes/group.js";
import { authenticate } from "./middleware/auth.js";
import Joi from "joi";
import { formatJoiError } from "./middleware/errorHandler.js";
import { expenseRouter } from "./routes/expense.js";
import { userRouter } from "./routes/user.js";
import { initSocket } from "./socket.js";

env.config();
const PORT = 3000;
const URI = process.env.MONGO_URI;

const app = e();
const server = createServer(app);
initSocket(server);

/* Experimental - START */
// console.log("import.meta.url", import.meta.url);
// console.log("fileURLToPath", fileURLToPath(import.meta.url));
// console.log("dirname", dirname(fileURLToPath(import.meta.url)));
/* Experimental - END */

app.use(e.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173", // here server is running
        credentials: true,
    }),
);

/* Socket.io START */
app.get("/socket", (req, res) => {
    return res.sendFile(join(dirname(fileURLToPath(import.meta.url)), "sockets", "index.html"));
});
/* Socket.io END */

app.use("/auth", authRouter);
app.use("/group", authenticate, groupRouter);
app.use("/expenses", authenticate, expenseRouter);
app.use("/users", userRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        server: `expense-splitter`,
        status: "healthy",
    });
});

app.get("/me", authenticate, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

// Central error handling
app.use((err, req, res, next) => {
    // Loggin the error stack on server console
    console.error("[Central Error Handler] : ", err.stack);

    if (Joi.isError(err)) {
        return res.status(400).json(formatJoiError(err));
    }

    return res.status(400).json(err);
    //   const statusCode = err.statusCode || 500;

    //   // Send a clean, standardized JSON response to the client
    //   res.status(statusCode).json({
    //     status: 'error',
    //     message: err.message || 'Internal server error',

    //     // Enabling full stack trace for development mode
    //     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    //   });
});

// app.listen(PORT, () => {
//     connectDb(URI)
//         .then(() => console.log("DB connected successfully!"))
//         .catch((err) => console.log(err));

//     console.log(`expense-splitter server listening on port ${PORT}`);
// });

server.listen(PORT, () => {
    connectDb(URI)
        .then(() => console.log("DB connected successfully!"))
        .catch((err) => console.log(err));

    console.log(`expense-splitter server listening on port ${PORT}`);
});
