import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { expenseSchema, paySchema } from "../validators/expense.validator.js";
import Expense from "../models/expenses.model.js";
import Group from "../models/group.model.js";
import { getIo } from "../socket.js";

const router = new Router();

const ERROR = {
    GROUP_NOT_FOUND: {
        message: "Group does not exist",
        code: "ERR_GROUP_NOT_FOUND",
    },
};

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        const group = await Group.findById(id);

        if (!group) {
            return res.status(404).json({ success: false, ...ERROR.GROUP_NOT_FOUND });
        }

        const expenses = await Expense.find({ groupId: id }).select({ amount: 1, description: 1, paidBy: 1 }).populate("paidBy", { email: 1 });

        return res.status(200).json({
            success: true,
            message: "Group expenses fetched successfully",
            data: expenses,
        });
    } catch (error) {
        throw error;
    }
});

router.post("/add", validate(expenseSchema), async (req, res) => {
    try {
        const { groupId, amount, description /* , paidBy */ } = req.body;
        const user = req.user;
        const paidBy = user.userId;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ success: false, ...ERROR.GROUP_NOT_FOUND });
        }

        const share = Number(amount / group.members.length).toFixed(2);

        // The current user/payer also a participant for the expesnse
        // Since current user/payer is paying the expense amount,
        // by default for the current user/payer owes is 0 and paid = share amount
        const participants = group.members.map((member) => ({
            email: member,
            owes: member == user.email ? 0 : share,
            paid: member == user.email ? share : 0,
            share,
        }));

        const expense = new Expense({ groupId, amount, description, paidBy, participants: participants });
        await expense.save();

        getIo()
            .to(groupId)
            .emit("expense:added", {
                ...expense.$toObject(),
                paidBy: {
                    name: user.email,
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
        const userEmail = req.user.email;

        const expense = await Expense.findOne({
            _id: expenseId,
            "participants.email": userEmail,
        }).lean();

        const updatedExpense = await Expense.updateOne(
            {
                _id: expenseId,
                participants: {
                    $elemMatch: {
                        email: userEmail,
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
        );

        getIo().to(expense.paidBy.toHexString()).emit("receivable:updated", { payer: userEmail, amount });
        res.status(200).json(updatedExpense);
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
