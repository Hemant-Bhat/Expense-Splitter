import mongoose, { Schema, model } from "mongoose";
// import User from "./user.model";

const groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    members: [
        {
            type: String,
            required: true,
            ref: 'User'
        }
    ],
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, { 
    timestamps: { 
        createdAt: true,
        updatedAt: true,
    }
})

const Group = model('Group', groupSchema);

export default Group;