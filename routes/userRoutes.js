import express from "express";
import multer from "multer";
import userSchema from "../models/Users.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "./uploads" })

router.get("/", async (_, res) => {
    try {
        const user = await userSchema.find();
        res.send(user)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await userSchema.findById(req.userId);
        res.send(user)
    } catch (err) {
        res.status(500).send(err)
    }
})


router.put("/:id", authMiddleware, upload.single("photo"), async (req, res) => {
    try {
        const updates = req.body;

        if (req.file) {
            updates.photo = req.file.filename
        }
        const user = await userSchema.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.send(user)
    } catch (err) {
        res.status(500).send(err)
    }
})


router.delete("/:id", async (req, res) => {
    try {
        const user = await userSchema.findByIdAndDelete(req.params.id);
        res.send(user)
    } catch (err) {
        res.status(500).send(err)
    }
})

export default router;