import express from "express";
import multer from "multer";
import userSchema from "../models/Users.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        console.log("Image", file);
        const uniqueSuffix = Date.now();
        const fileExtesion = file.mimetype.split("/")[1];
        const name = `${file.fieldname}-${uniqueSuffix}.${fileExtesion}`
        cb(null, name)
    }
})

const upload = multer({ storage: storage })

router.post('/register', upload.single("photo"), async (req, res) => {
    try {
        const { name, password, date, gender } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userSchema.create({
            name,
            password: hashedPassword,
            date,
            gender,
            photo: req.file.filename
        });
        res.status(201).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await userSchema.findOne({ name });
        if (!user) return res.status(404).send("User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).send("Invalid credentials");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router;