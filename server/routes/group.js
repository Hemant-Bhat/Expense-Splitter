import { Router } from "express";
import Group from "../models/group.model.js";
import { validate } from "../middleware/validate.js";
import { groupSchema, removeMemberSchema } from "../validators/group.validator.js";
import User from "../models/user.model.js";
import { MongooseError, Types } from "mongoose";
import Expense from "../models/expenses.model.js";
import { getIo } from "../socket.js";

const router = new Router();

const ERROR = {
    MEMBER_NOT_FOUND: {
        code: "ERR_MEMBER_NOT_FOUND",
        message: "One or more members do not exist",
    },
    GROUP_NOT_FOUND: {
        message: "Group not found",
        code: "ERR_GROUP_NOT_FOUND",
    },
};

router.get("/", async (req, res) => {
    try {
        // const groups = await Group.find({ $or: [{ creator: { _id: req.user.userId } }, { members: { $in: req.user.email } }] });
        const groups = await Group.find({ members: { $in: req.user.email } });
        return res.status(200).json({ success: true, message: "Groups fetched successfully", data: groups });
    } catch (error) {
        throw error;
    }
});

router.post("/create", validate(groupSchema), async (req, res) => {
    try {
        const { name, members } = req.body;
        const user = req.user;

        if (members.length > 0) {
            const existingUsers = await User.find({ email: { $in: members } }).select({ _id: 1 });

            if (existingUsers.length !== members.length) {
                return res.status(404).json({ success: false, ...ERROR.MEMBER_NOT_FOUND });
            }
        }

        const uniqueEmails = [...new Set([user.email, ...members])];

        const group = new Group({ name, creator: user.userId, members: uniqueEmails });
        await group.save();

        return res.status(200).json({ success: true, message: `"${name}" group created successfully` });
    } catch (error) {
        throw error;
    }
});

router.get("/:groupId", async (req, res) => {
    try {
        const { groupId } = req.params;
        const email = req.user.email;

        const group = await Group.find({
            _id: new Types.ObjectId(groupId),
            members: {
                $in: email,
            },
        }).populate("creator", { _id: 1, email: 1 });

        if (!group.length) {
            return res.status(404).json({ success: false, ...ERROR.GROUP_NOT_FOUND });
        }

        return res.status(200).json({ success: true, message: "Group fetched successfully", data: group[0] });
    } catch (error) {
        throw error;
    }
});

router.post("/:groupId/join", async (req, res) => {
    try {
        const { groupId } = req.params;
        const { members } = req.body;

        const existingUsers = await User.find({ email: { $in: members } }).select({ _id: 1 });

        if (existingUsers.length !== members.length) {
            return res.status(404).json({ success: false, ...ERROR.MEMBER_NOT_FOUND });
        }

        const updatedGroup = await Group.findByIdAndUpdate(groupId, {
            $addToSet: {
                members: { $each: members },
            },
        });

        if (!updatedGroup) {
            return res.status(404).json({ success: false, ...ERROR.GROUP_NOT_FOUND });
        }

        getIo().emit("member:added", updatedGroup);

        return res.status(200).json({ success: true, message: "Group member(s) added successfully" });
    } catch (error) {
        throw error;
    }
});

// TO DO: Remove Member
router.post("/:groupId/leave", validate(removeMemberSchema), async (req, res) => {
    try {
        const { groupId, members } = req.body;

        const updatedGroup = await Group.findOneAndUpdate(
            {
                _id: groupId,
                members: {
                    $in: members,
                },
            },
            {
                $pull: {
                    members: {
                        $in: members,
                    },
                },
            },
        );

        // if (existingUsers.length !== members.length) {
        //     return res.status(404).json({ success: false, ...ERROR.MEMBER_NOT_FOUND });
        // }

        // const updatedGroup = await Group.findByIdAndUpdate(groupId, {
        //     $addToSet: {
        //         members: { $each: members },
        //     },
        // });

        // if (!updatedGroup) {
        //     return res.status(404).json({ success: false, ...ERROR.GROUP_NOT_FOUND });
        // }

        return res.status(200).json({ success: true, message: "Group member(s) removed successfully" });
    } catch (error) {
        throw error;
    }
});

// Expenses Endpoints
router.get("/:groupId/expenses", async (req, res) => {
    try {
        const { groupId } = req.params;

        const expenses = await Expense.aggregate([
            {
                $match: {
                    groupId: new Types.ObjectId(groupId),
                },
            },
            {
                $set: {
                    participants: {
                        $filter: {
                            input: "$participants",
                            as: "p",
                            cond: { $gt: ["$$p.owes", 0] },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "paidBy",
                    as: "paidBy",
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
                $project: {
                    groupId: 1,
                    amount: 1,
                    description: 1,
                    createdAt: 1,
                    paidBy: { $first: "$paidBy" },
                    participants: 1,
                },
            },
        ]);
        return res.status(200).json({ success: true, message: "Group Expenses fetched successfully", data: expenses });
    } catch (error) {
        throw error;
    }
});

export { router as groupRouter };

// const createGroupWithMembers = async (name, members) => {
//     // const { name, members } = dto;

//     const existingUsers = await User.find({ email: { $in: members }}).select({ _id: 1});

//     if(existingUsers.length !== members.length){
//         //return res.status(400).json({ success: false, message: 'One or more members do not exist' })
//         throw Error("One or more members do not exist");
//     }

//     const uniqueMembers = [...new Set([req.user.userId, ...members ])];

//     const group = new Group({ name, creator: req.user.userId, members: uniqueMembers });
//     return group.save();
// }

// const createGroupWithMembersId = async (name, members) => {
//     // const { name, members } = dto;

//      const existingUsers = await User.find({ _id: { $in: members }}).select({ _id: 1});

//     if(existingUsers.length !== members.length){
//         //return res.status(400).json({ success: false, message: 'One or more members do not exist' })
//         throw Error("One or more members do not exists.");
//     }

//     const uniqueMembers = [...new Set([req.user.userId, ...members ])];

//     const group = new Group({ name, creator: req.user.userId, members: uniqueMembers });
//     return group.save();
// }
