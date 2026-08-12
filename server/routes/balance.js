import { Router } from "express";
import Expense from "../models/expenses.model.js";
import { Types } from "mongoose";
const { ObjectId } = Types;

const router = new Router();

router.get("/payable", async (req, res) => {
    try {
        const { email } = req.user;
        const pipeline = [
            {
                $match: {
                    "participants.email": email,
                },
            },
            {
                $set: {
                    userOweDetails: {
                        $filter: {
                            input: "$participants",
                            as: "p",
                            cond: {
                                $and: [{ $eq: ["$$p.email", email] }, { $gt: ["$$p.owes", 0] }],
                                // $gt: ["$$p.owes", 0],
                            },
                        },
                    },
                },
                // },
            },
            {
                $unset: ["participants"],
            },
            {
                $unwind: { path: "$userOweDetails" },
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "groupId",
                    foreignField: "_id",
                    as: "groupDetails",
                    pipeline: [
                        {
                            $project: {
                                name: "$name",
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "paidBy",
                    foreignField: "_id",
                    as: "paidByDetails",
                    pipeline: [
                        {
                            $project: {
                                email: 1,
                            },
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: "$userOweDetails.email",
                    totalRecords: {
                        $count: {},
                    },
                    totalOwes: {
                        $sum: "$userOweDetails.owes",
                    },
                    expenses: {
                        $push: {
                            expenseId: "$_id",
                            amount: "$amount",
                            description: "$description",
                            owes: "$userOweDetails.owes",
                            share: "$userOweDetails.share",
                            paid: "$userOweDetails.paid",
                            groupName: { $first: "$groupDetails.name" },
                            paidBy: { $first: "$paidByDetails.email" },
                        },
                    },
                },
            },
            {
                $unset: ["_id"],
            },
        ];

        const allPaybales = await Expense.aggregate(pipeline);
        let responseData = allPaybales[0] ?? {
            totalRecords: 0,
            totalOwes: 0,
            expenses: [],
        };

        res.status(200).json({ success: true, message: "Payable details fetched successfully", data: responseData });
    } catch (error) {
        throw error;
    }
});

router.get("/receivable", async (req, res) => {
    try {
        const pipeline = [
            {
                $match: {
                    paidBy: new ObjectId(req.user.userId),
                },
            },
            {
                $unwind: "$participants",
            },
            {
                $match: {
                    "participants.owes": {
                        $gt: 0,
                    },
                },
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "groupId",
                    foreignField: "_id",
                    as: "groupDetails",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                _id: 0,
                            },
                        },
                    ],
                },
            },
            // {
            //     $set: {
            //         participants: {
            //             $filter: {
            //                 input: "$participants",
            //                 as: "p",
            //                 cond: { $gt: ["$$p.owes", 0] },
            //             },
            //         },
            //     },
            // },
            // {},
            // {
            //     $project: {
            //         groupId: 1,
            //         amount: 1,
            //         description: 1,
            //         participants: {
            //             $filter: {
            //                 input: "$participants",
            //                 as: "p",
            //                 cond: { $gt: ["$$p.owes", 0] },
            //             },
            //         },
            //     },
            // },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$$ROOT", { groupName: { $first: "$groupDetails.name" } }, { participant: "$participants" }],
                    },
                },
            },
            {
                $unset: ["participants", "groupDetails", "__v"],
            },
            {
                $group: {
                    _id: "$paidBy",
                    totalRecords: { $count: {} },
                    totalOwed: { $sum: { $ceil: "$participant.owes" } },
                    receivables: {
                        $push: {
                            _id: "$participant._id",
                            expenseId: "$_id",
                            groupId: "$groupId",
                            groupName: "$groupName",
                            description: "$description",
                            amount: "$amount",
                            participant: "$participant",
                        },
                    },
                },
            },
            {
                $unset: ["_id"],
            },
        ];

        const allReceivables = await Expense.aggregate(pipeline);

        res.status(200).json({ success: true, message: "Receivable details fetched successfully", data: allReceivables[0] });
    } catch (error) {
        throw error;
    }
});

export { router as balanceRouter };
