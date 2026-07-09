import { Schema, model } from "mongoose";

const expenseSchema = new Schema(
    {
        groupId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Group",
        },
        amount: {
            type: Number,
            required: true,
        },
        description: String,
        paidBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        participants: [
            {
                email: {
                    type: String,
                    required: true,
                    ref: "User",
                },
                share: {
                    type: Number,
                    required: true,
                },
                owes: {
                    type: Number,
                    required: true,
                },
                paid: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    },
);

const Expense = model("Expense", expenseSchema);

export default Expense;
