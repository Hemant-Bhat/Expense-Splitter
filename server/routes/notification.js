import { Router } from "express";
import Expense from "../models/expenses.model.js";
import User from "../models/user.model.js";
import { validate } from "../middleware/validate.js";
import { nofitySchema } from "../validators/notification.validator.js";
import { getIo } from "../socket.js";

const router = new Router();

router.post("/notify", validate(nofitySchema), async (req, res) => {
    try {
        const user = req.user;
        const { expenseId, participantEmail } = req.body;
        const participantAsUser = await User.findOne({ email: participantEmail }).select({ _id: 1, email: 1, currency: 1 }).lean();

        if (!participantAsUser) {
            return res.status(404).json({ success: false, code: "INVALID_PARTICIPANT", message: `${participantEmail} is invalid participant` });
        }

        const expense = await Expense.findOne(
            {
                _id: expenseId,
                participants: {
                    $elemMatch: {
                        email: participantAsUser.email,
                        owes: { $gte: 1 },
                    },
                },
            },
            {
                participants: {
                    $filter: {
                        input: "$participants",
                        as: "p",
                        cond: { $eq: ["$$p.email", participantAsUser.email] },
                    },
                },
            },
        ).lean();

        if (!expense) {
            return res.status(404).json({ success: false, code: "INVALID_EXPENSE", message: `Invalid expense` });
        }

        getIo()
            .to(participantAsUser._id.toHexString())
            .emit("notification:updated", {
                title: "Notification",
                content: `${user.email} has requested payment of your outstanding dues: ${participantAsUser.currency.symbol} ${expense.participants[0].owes} `,
                data: expense.participants[0],
            });

        return res.status(200).json({ success: true, message: "Notification sent to participant" });
    } catch (error) {
        throw error;
    }
});

export { router as notificationRouter };
