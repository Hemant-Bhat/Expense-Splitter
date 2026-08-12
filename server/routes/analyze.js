import { Router } from "express";
import Expense from "../models/expenses.model.js";
import { Types } from "mongoose";

const router = new Router();

// router.get("/spendings/:year/:month", (req, res) => {
//     console.log(req.params);
//     return res.status(200).json({ ...req.param });
// });

router.get("/spendings/monthly", async (req, res) => {
    try {
        const user = req.user;

        const spendings = await Expense.aggregate([
            {
                $match: {
                    paidBy: new Types.ObjectId(user.userId),
                },
            },
            {
                $sort: { createdAt: 1 },
            },
            {
                $group: {
                    // _id: { amount: { $gte: ["$createdAt", new Date("2026-08-01")] } },
                    _id: { month: { $month: "$createdAt" } },
                    totalSpendingCount: { $count: {} },
                    totalSpendedAmount: { $sum: "$amount" },
                    spendings: {
                        $push: {
                            id: "$_id",
                            amount: "$amount",
                            createdAt: "$createdAt",
                        },
                    },
                },
            },
            {
                $project: {
                    month: "$_id.month",
                    monthName: {
                        $arrayElemAt: [["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], { $subtract: ["$_id.month", 1] }],
                    },
                    totalSpendingCount: 1,
                    totalSpendedAmount: 1,
                    spendings: 1,
                },
            },
            {
                $sort: { month: 1 },
            },
            {
                $unset: ["_id"],
            },
        ]);
        // console.log(spendings);
        return res.status(200).json({ succeess: true, message: "Spending analysis fetched successfully", spendings: spendings });
    } catch (error) {
        throw error;
    }
});

router.get("/spendings/yearly", async (req, res) => {
    try {
        const { userId, email } = req.user;
        const year = Number(req.query.year);
        if (isNaN(year)) {
            return res.status(400).json({ succeess: false, message: "Invalid year" });
        }
        const data = await Expense.aggregate([
            {
                $match: {
                    $or: [{ paidBy: new Types.ObjectId(userId) }, { "participants.email": email }],
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${year + 1}-01-01`),
                    },
                },
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "groupId",
                    foreignField: "_id",
                    as: "groupInfo",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                },
            },
            // {
            //     $lookup: {
            //         from: "users",
            //         localField: "paidBy",
            //         as: "userInfo",
            //         foreignField: "_id",
            //         pipeline: [
            //             {
            //                 $project: {
            //                     email: 1,
            //                 },
            //             },
            //         ],
            //     },
            // },
            {
                $set: {
                    // When the current user paid, they are not stored in participants.
                    // Since the expense is split equally, any participant's share
                    // represents the current user's own share.
                    userShare: { $first: "$participants.share" },
                    participants: {
                        $filter: {
                            input: "$participants",
                            as: "p",
                            cond: { $eq: ["$$p.email", email] },
                        },
                    },
                },
            },
            {
                $unwind: { path: "$participants", preserveNullAndEmptyArrays: true },
            },
            {
                $group: {
                    _id: {
                        groupId: "$groupId",
                        year: { $year: "$createdAt" },
                    },
                    totalCount: { $count: {} },
                    totalGroupSpendings: { $sum: "$userShare" },
                    groupName: { $first: { $first: "$groupInfo.name" } },
                    groupId: { $first: { $first: "$groupInfo._id" } },
                    spendings: {
                        $push: {
                            // __ROOT__: "$$ROOT",
                            expenseId: "$_id",
                            share: "$userShare",
                            description: "$description",
                            createdAt: "$createdAt",
                        },
                    },
                },
            },
            {
                $unset: ["_id"],
            },
            {
                $group: {
                    _id: "$_id.year",
                    totalCount: { $count: {} },
                    totalYearSpendings: { $sum: "$totalGroupSpendings" },
                    groups: {
                        $push: "$$ROOT",
                    },
                },
            },
        ]);
        return res.status(200).json({ succeess: true, message: "Group spendings fetched successfully", data: data[0] });
    } catch (error) {
        throw error;
    }
});

router.get("/spendings/trend", async (req, res) => {
    try {
        const { userId } = req.user;

        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - 30);
        const end = new Date(today);
        end.setDate(today.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        const data = await Expense.aggregate([
            {
                $match: {
                    paidBy: new Types.ObjectId(userId),
                    createdAt: {
                        $gte: start,
                        $lt: end,
                    },
                },
            },
            {
                $project: {
                    expesneId: "$_id",
                    amount: 1,
                    description: 1,
                    createdAt: 1,
                },
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$createdAt" },
                    totalAmount: { $sum: "$amount" },
                    date: { $first: "$createdAt" },
                    spendings: {
                        $push: "$$ROOT",
                    },
                },
            },
            {
                $sort: { date: 1 },
            },
            {
                $project: {
                    totalAmount: 1,
                    spendings: 1,
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                },
            },
        ]);
        // .select({ amount: 1, createdAt: 1, description: 1 })
        // .lean();

        return res.status(200).json({ succeess: true, message: "Spending trend fetched successfully", data: data });
    } catch (error) {
        throw error;
    }
});

// router.get("/group-spendings", async (req, res) => {
//     try {
//         const { userId, email } = req.user;
//         const year = req.query.year || 2026;
//         const data = await Expense.aggregate([
//             {
//                 $match: {
//                     $or: [{ paidBy: new Types.ObjectId(userId) }, { "participants.email": email }],
//                     createdAt: {
//                         $gte: new Date(`${year}-01-01`),
//                         $lt: new Date(`${year + 1}-01-01`),
//                     },
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "groups",
//                     localField: "groupId",
//                     foreignField: "_id",
//                     as: "groupInfo",
//                     pipeline: [
//                         {
//                             $project: {
//                                 name: 1,
//                             },
//                         },
//                     ],
//                 },
//             },
//             // {
//             //     $lookup: {
//             //         from: "users",
//             //         localField: "paidBy",
//             //         as: "userInfo",
//             //         foreignField: "_id",
//             //         pipeline: [
//             //             {
//             //                 $project: {
//             //                     email: 1,
//             //                 },
//             //             },
//             //         ],
//             //     },
//             // },
//             {
//                 $set: {
//                     // When the current user paid, they are not stored in participants.
//                     // Since the expense is split equally, any participant's share
//                     // represents the current user's own share.
//                     userShare: { $first: "$participants.share" },
//                     participants: {
//                         $filter: {
//                             input: "$participants",
//                             as: "p",
//                             cond: { $eq: ["$$p.email", email] },
//                         },
//                     },
//                 },
//             },
//             {
//                 $unwind: { path: "$participants", preserveNullAndEmptyArrays: true },
//             },
//             {
//                 $group: {
//                     _id: {
//                         groupId: "$groupId",
//                         year: { $year: "$createdAt" },
//                     },
//                     totalCount: { $count: {} },
//                     totalGroupSpendings: { $sum: "$userShare" },
//                     groupName: { $first: { $first: "$groupInfo.name" } },
//                     groupId: { $first: { $first: "$groupInfo._id" } },
//                     spendings: {
//                         $push: {
//                             // __ROOT__: "$$ROOT",
//                             expenseId: "$_id",
//                             share: "$userShare",
//                             description: "$description",
//                             createdAt: "$createdAt",
//                         },
//                     },
//                 },
//             },
//             {
//                 $unset: ["_id"],
//             },
//             {
//                 $group: {
//                     _id: "$_id.year",
//                     totalCount: { $count: {} },
//                     totalYearSpendings: { $sum: "$totalGroupSpendings" },
//                     groups: {
//                         $push: "$$ROOT",
//                     },
//                 },
//             },
//         ]);
//         return res.status(200).json({ succeess: true, message: "Group spendings fetched successfully", data: data[0] });
//     } catch (error) {
//         throw error;
//     }
// });

export { router as analyzeRouter };
