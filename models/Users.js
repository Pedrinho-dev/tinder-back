import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String },
    password: { type: Number },
    date: {type: Date},
    gender: { type: String}
})
const User = mongoose.model('User', userSchema);

export default User;