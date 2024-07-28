import express from 'express';
// const express = require("express");
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';


mongoose
    .connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('Db connected');
    }).catch((err) => {
        console.log(err);
    })

const app = express();

app.use(express.json())

app.listen(3000, () => {
    console.log('Server is listening at port 3000')
})

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);