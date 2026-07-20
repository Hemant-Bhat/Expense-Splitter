import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { expenseSchema } from "../validators/expense.validator.js";
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

        const existingGroup = await Group.findById(id);

        if (!existingGroup) {
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

        const existingGroup = await Group.findById(groupId);

        if (!existingGroup) {
            return res.status(404).json({ success: false, ...ERROR.GROUP_NOT_FOUND });
        }

        const share = amount / existingGroup.members.length;
        const participants = existingGroup.members
            .filter((member) => member != user.email)
            .map((member) => ({
                email: member,
                owes: share,
                paid: 0,
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
