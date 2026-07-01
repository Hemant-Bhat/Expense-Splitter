import { Router } from "express";
import Group from "../models/group.model.js";
import { validate } from "../middleware/validate.js";
import { groupSchema } from "../validators/group.validator.js";
import User from "../models/user.model.js";
import { MongooseError } from "mongoose";

const router = new Router();

const ERROR = {
    MEMBER_NOT_FOUND: {
        code: "ERR_MEMBER_NOT_FOUND",
        message: 'One or more members do not exist'
    },
    GROUP_NOT_FOUND: {
        message: "Group does not exist",
        code: "ERR_GROUP_NOT_FOUND"
    }
}

router.get('/', async (req, res) => {

    try {
        const groups = await Group.find()
        return res.status(200).json({ success: true, message: 'Groups fetched successfully', data: groups })

    } catch (err) {
        console.log(err);
        throw err
    }
})

router.post('/create', validate(groupSchema), async (req, res) => {
    try {
        const { name, members } = req.body;

        const existingUsers = await User.find({ email: { $in: members } }).select({ _id: 1 });

        if (existingUsers.length !== members.length) {
            return res.status(404).json({ success: false, ...ERROR.MEMBER_NOT_FOUND })
        }

        const uniqueMembers = [...new Set([req.user.email, ...members])];

        const group = new Group({ name, creator: req.user.userId, members: uniqueMembers });
        await group.save();

        return res.status(200).json({ success: true, message: `"${name}" group created successfully` })
    } catch (err) {
        console.log('/AAAA/')
        throw err
    }
})

router.post('/:id/join', async (req, res) => {
    try {
        const { id } = req.params;
        const { members } = req.body;

        const existingUsers = await User.find({ email: { $in: members } }).select({ _id: 1 });

        if (existingUsers.length !== members.length) {
            return res.status(404).json({ success: false, ...ERROR.MEMBER_NOT_FOUND })
        }

        const updatedGroup = await Group.findByIdAndUpdate(id, {
            $addToSet: {
                members: { $each: members }
            }
        });

        if (!updatedGroup) {
            return res.status(404).json({ success: false, ...ERROR.GROUP_NOT_FOUND })
        }

        return res.status(200).json({ success: true, message: "Group member(s) added successfully" })
    } catch (error) {
        console.log(error);
    }
})

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