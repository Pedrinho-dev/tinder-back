import express from "express";
import multer from "multer";
import userSchema from "../models/Users.js";

const router = express.Router();

router.get("/", async (_, res) => {
    try {
        const user = await userSchema.find();
        res.send(user)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get("/:id", async (req, res) => {
    try {
        const user = await userSchema.findById(req.params.id);
        res.send(user)
    } catch (err) {
        res.status(500).send(err)
    }
})


const upload = multer({dest: "./uploads"})
router.post("/", upload.single("photo"), async (req, res) => {
    try {
        const { name, password, date, gender } = req.body;
        const user = await userSchema.create({ name, password, date, gender, photo: req.file.filename });
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
})



router.put("/:id", async (req, res) => {
    try {
        const { name, password, date, gender } = req.body;
        const user = await userSchema.findByIdAndUpdate(req.params.id, { name, password, date, gender }, { new: true });
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