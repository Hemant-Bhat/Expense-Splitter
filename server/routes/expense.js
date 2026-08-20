import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { expenseSchema, paySchema } from "../validators/expense.validator.js";
import Expense from "../models/expenses.model.js";
import Group from "../models/group.model.js";
import { getIo } from "../socket.js";
import { Types } from "mongoose";

const router = new Router();

const ERROR = {
    INVALID_EXPENSE: {
        success: false,
        message: "Invalid expense",
        code: "ERR_INVALID_EXPENSE",
    },
    INVALID_GROUP: {
        success: false,
        message: "Invalid group to add expense",
        code: "ERR_INVALID_GROUP",
    },
    GROUP_NOT_FOUND: {
        success: false,
        message: "Group does not exist",
        code: "ERR_GROUP_NOT_FOUND",
    },
};

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.user;

        const group = await Group.findOne({ _id: id, members: email });

        if (!group) {
            return res.status(404).json(ERROR.GROUP_NOT_FOUND);
        }

        const expenses = await Expense.find({ groupId: id }).select({ amount: 1, description: 1, paidBy: 1 }).populate("paidBy", { email: 1 });

        return res.status(200).json({
            success: true,
            message: "Expenses details fetched successfully",
            data: expenses,
        });
    } catch (error) {
        throw error;
    }
});

router.post("/add", validate(expenseSchema), async (req, res) => {
    try {
        const { groupId, amount, description } = req.body;
        const { userId: paidBy, email } = req.user;

        const group = await Group.findOne({ _id: new Types.ObjectId(groupId), members: email });

        if (!group) {
            return res.status(404).json(ERROR.INVALID_GROUP);
        }

        const share = Number(amount / group.members.length).toFixed(2);

        // The current user/payer also a participant for the expesnse
        // Since current user/payer is paying the expense amount,
        // by default for the current user/payer owes is 0 and paid = share amount
        // This change help us to calculate the spedings accurately for reports/analysis
        const participants = group.members.map((member) => ({
            email: member,
            owes: member == email ? 0 : share,
            paid: member == email ? share : 0,
            share,
        }));

        const expense = new Expense({ groupId, amount, description, paidBy, participants: participants });
        await expense.save();

        getIo()
            .to(groupId)
            .emit("expense:added", {
                ...expense.$toObject(),
                paidBy: {
                    name: email,
                    id: paidBy,
                },
            });
        return res.status(200).json({ success: true, message: "Expense added successfuly" });
    } catch (error) {
        throw error;
    }
});

router.post("/pay", validate(paySchema), async (req, res) => {
    try {
        const { expenseId, amount } = req.body;
        const { email } = req.user;

        const expense = await Expense.findOne({
            _id: expenseId,
            participants: {
                $elemMatch: {
                    email,
                    owes: { $gt: 0 },
                },
            },
        }).lean();

        if (!expense) {
            return res.status(404).json(ERROR.INVALID_EXPENSE);
        }

        const updatedExpense = await Expense.updateOne(
            {
                _id: expense._id,
                participants: {
                    $elemMatch: {
                        email: email,
                        owes: { $gt: 0 },
                    },
                },
            },
            {
                $inc: {
                    "participants.$.owes": -amount,
                    "participants.$.paid": amount,
                },
            },
        ).lean();

        if (!updatedExpense.modifiedCount) {
            return res.status(404).json(ERROR.INVALID_EXPENSE);
        }

        getIo().to(expense.paidBy.toHexString()).emit("receivable:updated", { payer: email, amount });
        return res.status(200).json({ success: true, messsage: "Expense amount paid successfully" });
    } catch (error) {
        throw error;
    }
});

export { router as expenseRouter };

// Logic to be Implement
// const share = totalAmount / group.members.length;

// const expenseMembers = group.members.map(member => ({
//   email: member.email,
//   amount:
//     member.email === paidBy
//       ? share - totalAmount // e.g. 300 - 1200 = -900
//       : share,
// }));
