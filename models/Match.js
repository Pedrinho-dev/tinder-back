import mongoose from "mongoose";

const matchSchema = mongoose.Schema({
    userLiked: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    userLiker: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
})

const Match = mongoose.model("Match", matchSchema);
export default Match;