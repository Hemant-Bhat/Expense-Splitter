import mongoose from "mongoose";

const User = mongoose.model('User', {
    email: String
})

export default User;