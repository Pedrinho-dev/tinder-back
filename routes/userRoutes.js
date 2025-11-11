import express from "express";
import multer from "multer";
import bcrypt from "bcrypt"
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
        const { name, password, date, gender, interest } = req.body;

        const updateData = { name, date, gender, interest };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (req.file) {
            updateData.photo = req.file.filename;
        }

        const user = await userSchema.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ message: "Error updating user", detail: err.message });
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