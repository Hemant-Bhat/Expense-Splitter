import { Router } from "express";
import Group from "../models/group.model.js";
import { validate } from "../middleware/validate.js";
import { groupSchema, removeMemberSchema } from "../validators/group.validator.js";
import User from "../models/user.model.js";
import { MongooseError } from "mongoose";
import Expense from "../models/expenses.model.js";
import { getIo } from "../socket.js";

const router = new Router();

const ERROR = {
    MEMBER_NOT_FOUND: {
        code: "ERR_MEMBER_NOT_FOUND",
        message: "One or more members do not exist",
    },
    GROUP_NOT_FOUND: {
        message: "Group does not exist",
        code: "ERR_GROUP_NOT_FOUND",
    },
};

router.get("/", async (req, res) => {
    try {
        const groups = await Group.find({ $or: [{ creator: { _id: req.user.userId } }, { members: { $in: req.user.email } }] });
        return res.status(200).json({ success: true, message: "Groups fetched successfully", data: groups });
    } catch (err) {
        console.log(err);
        throw err;
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
    } catch (err) {
        console.log("/AAAA/");
        throw err;
    }
});

router.get("/:groupId", async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await Group.findById(groupId).populate("creator", { _id: 1, email: 1 });
        return res.status(200).json({ success: true, message: "Group fetched successfully", data: group });
    } catch (err) {
        console.log(err);
        throw err;
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
        console.log(error);
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

        console.dir(updatedGroup);
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
        console.log(error);
    }
});

// Expenses Endpoints
router.get("/:groupId/expenses", async (req, res) => {
    try {
        const { groupId } = req.params;

        const expenses = await Expense.find({ groupId: groupId }).populate("paidBy", { _id: 1, email: 1 });
        return res.status(200).json({ success: true, message: "Group Expenses fetched successfully", data: expenses });
    } catch (err) {
        console.log(err);
        throw err;
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
