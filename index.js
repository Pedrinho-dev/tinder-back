import express from 'express';
import mongoose from 'mongoose';
import userSchema from './models/Users.js'
import dotenv from 'dotenv'

dotenv.config();
const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI;

const server = express();
server.use(express.json())

server.get('/', (_, res) => {
    res.send('Alive!!')
})

server.post('/user', async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await userSchema.create({ name, password });
        res.send(user);
    }catch(err){
        res.send(err)
    }
    
})

mongoose.connect(mongo_uri).then(() => {
    server.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })
}).catch(err => {
    console.log(err)
})
