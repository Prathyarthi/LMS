import AppError from "../utils/appError.js";
import user from '../models/user.model.js';
import cloudinary from 'cloudinary';
import sendEmail from "../utils/sendEmail.js";

const cookieOptions = {
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    httpOnly: true
}

const signup = async (req, res, next) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return next(new AppError('All fields are required!', 400));
    }

    const userExists = await user.findOne({ email });

    if (userExists) {
        return next(new AppError('Email already exists!', 400));
    }

    const User = await user.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email, 
            secure_url: 'https://res.cloudinary.com/fgfdkj78/avatar.png'
        }
    })

    if (!User) {
        return next(new AppError('User registration failed!', 400));
    }

    console.log('File Details : ', JSON.stringify(req.file));
    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });

            if (result) {
                User.avatar.public_id = result.public_id;
                User.avatar.secure_url = result.secure_url;

                // Remove file from the local server
                //fs.rem(`upload/${req.file.filename}`);
            }
        } catch (e) {
            return next(new AppError(e.message || 'File not uploaded, please try again', 500));
        }
    }

    await User.save();

    const token = await User.generateJWTToken();
    res.cookie('token', token, cookieOptions);

    User.password = undefined;   // To not send the password again as response(bad practice)

    res.status(200).json({
        success: true,
        message: 'User registered successfully',
        User
    })
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('All fields are required!'), 400);
    }

    const User = await user.findOne({
        email
    }).select('+password');   // To find that particular email with the password from the database

    if (!User || !User.comparePassword(password)) {
        return next(new AppError("Email and password doesn't match!", 400));
    }

    const token = await User.generateJWTToken();
    User.password = undefined;

    res.cookie('token', token, cookieOptions);

    res.status(201).json({
        success: true,
        message: 'User registered successfully!',
        User
    })
}

const logout = (req, res) => {
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully!'
    });
}

const getProfile = (req, res) => {
    const User = user.findById(req.user.id);

    res.status(200).json({
        success: true,
        message: 'User Details',
        User
    })
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError("Email is required!", 400));
    }

    const User = await User.findOne({ email });

    if (!User) {
        return next(new AppError("Email not Found!", 400));
    }

    const resetToken = await User.generatePasswordToken();
    await user.save();

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const subject = 'Reset Password';
    const message = `You can change your password by clicking on this URL -><a>${resetPasswordUrl}<a/>`;

    try {
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset Password token is to ${email} successfully!`
        })
    } catch (e) {
        User.forgotPasswordToken = undefined;
        User.forgotPasswordExpiry = undefined;
        await next(new AppError(e.message, 500));
    }
}

const resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    const User = await user.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    })

    this.forgotPasswordToken = crypto
        .createHash('sha65')
        .update(resetToken)
        .digest('hex')
        ;

    if (!User) {
        return next(new AppError("Token is invalid or expired, please try again!", 400));
    }

    User.password = password;
    // After reset, we are setting forgotPasswordExpiry , forgotPasswordToken to undefined 
    User.forgotPasswordExpiry = undefined;
    User.forgotPasswordToken = undefined;

    await User.save();

    res.status(200).json({
        success: true,
        message: 'Password changed sucessfully!'
    })

}

export {
    signup,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword
}