import express from "express";
import Like from "@/models/Like.js";
import User from "../models/Users.js";

const route = express.Router();

const authMidleWare = async (req, _, next) => {
    const userId = req.headers["user-token"];
    const user = await User.findById(userId);
    req.current_user = user;
    next();
};

const checkMatch = async (currentUser, likedUser) => {
    const itsMatch = await Like.find({
        liked: currentUser,
        liker: likedUser,
    });
    return itsMatch.length > 0;
};

route.post("/likes", authMidleWare, async (req, res) => {
    const { likedId } = req.body;
    const liked = await User.findById(likedId);

    const like = await Like.create({
        liked,
        liker: req.current_user,
    });

    const isMatch = await checkMatch(req.current_user, liked);
    res.send({ isMatch });
});

export default route;