import express from 'express';
// const express = require("express");
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose
    .connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('Db connected');
    }).catch((err) => {
        console.log(err);
    })

const app = express();

app.listen(4000, () => {
    console.log('Server is listening at port 4000')
})