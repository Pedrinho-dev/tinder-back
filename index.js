import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI;

const server = express();
server.use(cors())
server.use(express.json())

server.get('/', (_, res) => {
    res.send('Alive!!')
})

server.use("/user", userRoutes);
server.use("/auth", authRoutes);

mongoose.connect(mongo_uri).then(() => {
    server.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })
}).catch(err => {
    console.log(err)
})
