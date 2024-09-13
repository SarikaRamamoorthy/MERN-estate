import express from 'express';
// const express = require("express");
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';


mongoose
    .connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('Db connected');
    }).catch((err) => {
        console.log(err);
    })


const __dirname = path.resolve();

const app = express();

app.use(express.json())
app.use(cookieParser())

app.listen(3000, () => {
    console.log('Server is listening at port 3000')
})

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')))


app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.js'));
})


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})