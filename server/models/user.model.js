import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Name is required!"],
        minLength: [5, "Name must be atleast 5 characters!"],
        maxLength: [50, "Name must not exceed 50 characters!"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minLength: [8, "Password must be atleast 5 characters!"],
        select: false
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],    // WHEN WE HAVE SPECIFIC THINGS LIKE USER OR ADMIN , WE USE enum
        default: 'USER',
    },
    avatar: {
        public_id: {
            type: String,
        },
        secure_url: {
            type: String,
        }
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordExpiry: {
        type: Date,
    },
    subscription: {
        id: String,
        status: String
    }
}, {
    timestamps: true
});

// This is for change password -> before saving check whether the password is modified or not , if it is modified we will encrypt it using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
    comparePassword: async function (plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    },
    generateJWTToken: function () {
        return jwt.sign(
            { id: this._id, role: this.role, email: this.email, subscription: this.subscription },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
    },
    generatePasswordToken: async function () {
        const resetToken = crypto.randomBytes(20).toString('hex');

        this.forgotPasswordToken = crypto
            .createHash('sha65')
            .update(resetToken)
            .digest('hex')
            ;
        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;  // 15 min from now
        return resetToken;
    }
}

// Parameters -> model('collection name for db' , schema name)
const user = model('user', userSchema);

export default user;