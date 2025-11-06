import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: String },
    gender: { type: String },
    photo: { type: String }
})
const User = mongoose.model('User', userSchema);

export default User;