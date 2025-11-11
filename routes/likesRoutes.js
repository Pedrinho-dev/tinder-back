import express from "express";
import Like from "../models/Like.js";
import User from "../models/Users.js";
import Match from "../models/Match.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const route = express.Router();

const checkMatch = async (currentUserId, likedUserId) => {
    const match = await Like.findOne({
        liked: currentUserId,
        liker: likedUserId,
    });
    const isMatch = Boolean(match);
    if (isMatch) {
        const alreadyMatched = await Match.findOne({
            userLiked: currentUserId,
            userLiker: likedUserId,
        });

        if (!alreadyMatched) {
            await Match.create({ userLiked: currentUserId, userLiker: likedUserId });
            console.log("Its a MATCHHHH!!");
            return { isMatch: true, match: newMatch };
        }
    }
    return isMatch;
};

route.post("/likes", authMiddleware, async (req, res) => {
    try {
        const { likedId } = req.body ?? {};

        if (!likedId) {
            return res.status(400).send({ message: "likedId is required." });
        }

        if (likedId === req.userId) {
            return res.status(400).send({ message: "You can't like yourself." });
        }

        const likedUser = await User.findById(likedId);
        if (!likedUser) {
            return res.status(404).send({ message: "User not found." });
        }

        const existing = await Like.findOne({ liked: likedId, liker: req.userId });
        if (existing) {
            const { isMatch, match } = await checkMatch(req.userId, likedId);
            return res.status(200).send({ isMatch, match });
        }

        const like = await Like.create({
            liked: likedId,
            liker: req.userId,
        });

        const { isMatch, match } = await checkMatch(req.userId, likedId);
        res.status(201).send({ isMatch, likeId: like._id, match });
    } catch (err) {
        res.status(500).send({ message: "Erro ao registrar like.", detail: err.message });
    }
});

route.get("/", async (_, res) => {
    try {
        const likes = await Like.find();
        res.send(likes)
    } catch (err) {
        res.status(500).send(err)
    }
})

route.get("/received/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const receivedLikes = await Like.find({ liked: id }).populate("liker");
        res.status(200).send(receivedLikes);
    } catch (err) {
        res.status(500).send({ message: "Erro ao buscar likes recebidos.", detail: err.message });
    }
});

route.get("/matches", async (_, res) => {
    try {
        const match = await Match.find();
        res.send(match)
    } catch (err) {
        res.status(500).send(err)
    }
})

route.get("/matches/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const matches = await Match.find({
            $or: [
                { userLiked: id },
                { userLiker: id }
            ]
        }).populate("userLiked").populate("userLiker");


        const otherUsers = matches.map(match => {
            if (match.userLiked._id.toString() === id) {
                return match.userLiker;
            } else {
                return match.userLiked;
            }
        });

        res.status(200).send(otherUsers);
    } catch (err) {
        res.status(500).send({ message: "Erro ao buscar matches.", detail: err.message });
    }
});

export default route;
