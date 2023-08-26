const { default: AppError } = require("../utils/appError");
const user = require('../models/user.model')

const cookieOptions = {
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    httpOnly: true
}

const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return next(new AppError('All fields are required!'), 400);
    }

    const userExists = await user.findOne({ email });

    if (userExists) {
        return next(new AppError('Email already exists!', 400));
    }

    const user = await user.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: ''
        }
    })

    if (!user) {
        return next(new AppError('User registration failed!', 400));
    }

    await user.save();

    user.password = undefined;   // To not send the password again as response(bad practice)

    res.status(200).json({
        success: true,
        message: 'User registered successfully',
        user

    })
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('All fields are required!'), 400);
    }

    const userExists = await user.findOne({
        email
    }).select('+password');   // To find that particular email with the password from the database

    if (!user || user.comparePassword(password)) {
        return next(new AppError("Email and password doesn't match!", 400));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie('token', token, cookieOptions);

    res.status(201).json({
        success: true,
        message: 'User registered successfully!',
        user
    })
}

const logout = (req, res) => {
    res.cookie('token', null, {
        secur: true,
        maxAge: 0,
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully!'
    });
}

const getProfile = (req, res) => {
    const user = user.findById(req.user.id);

    res.status(200).json({
        success: true,
        message: 'User Details',
        user
    })
}

module.exports = {
    signup,
    login,
    logout,
    getProfile
}