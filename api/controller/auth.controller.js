import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({username, email, password : hashedPassword});
    try {
        await newUser.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        next(error);
        // the next() calls the middleware in index.js
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {

        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404, 'User not found!'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

        const {password : pwd , ...rest} = validUser._doc;
        const token = jwt.sign({id : validUser._id}, process.env.JWT_SECRET);
        res
            .cookie('access_token', token, {httpOnly : true})
            .status(200)
            .json(rest);

    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    try {
        const validUser = await User.findOne({email : req.body.email});
        if(validUser) {
            const {password : pwd , ...rest} = validUser._doc;
            const token = jwt.sign({id : validUser._id}, process.env.JWT_SECRET);
            res
                .cookie('access_token', token, {httpOnly : true})
                .status(200)
                .json(rest);
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            /* creates a 16 digit password 36 includes numbers and letters
            */
           const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
           const newUser = new User({username : req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4), email : req.body.email, password : hashedPassword, avatar: req.body.photo});
            await newUser.save();
            const {password : pwd , ...rest} = newUser._doc;
            const token = jwt.sign({id : newUser._id}, process.env.JWT_SECRET);
        res
            .cookie('access_token', token, {httpOnly : true})
            .status(200)
            .json(rest);
        }
        
    } catch (error) {
        next(error);
    }
}