import { Router } from "express";
import User from "../models/user.model.js";

const router = new Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.find().select({ password: 0 });
        return res.status(200).json({ success: true, message: "Users fetched successfully", data: users });
    } catch (error) {
        throw error;
    }
});

export { router as userRouter };
