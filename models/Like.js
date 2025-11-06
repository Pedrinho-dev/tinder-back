import mongoose from "mongoose";

const likeSchema = mongoose.Schema("Like", {
    liked: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    liker: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }
})

const Like = mongoose.model("Likes", likeSchema);

export default Like;