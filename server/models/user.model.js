import mongoose from "mongoose";

const { Schema, model } = mongoose

const userShema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    }
})

const User = model('User', userShema)

export default User;