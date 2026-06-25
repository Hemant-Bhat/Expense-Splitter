import { Schema, model } from "mongoose";

const groupSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

const Group = model('Group', groupSchema);

export default Group;