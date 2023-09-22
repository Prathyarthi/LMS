import AppError from "../utils/appError.js";
import Payment from "../models/payment.model.js";
import user from '../models/user.model.js';

const getRazorpayApiKey = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Razorpay API KEY',
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const buySubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const User = await user.findById(id);

        if (!User) {
            return next(new AppError('Unauthorized! , Please Login', 500));
        }

        if (User.role === 'ADMIN') {
            return next(new AppError('ADMIN cannot purchase a subscription!', 400));
        }

        const subscription = await razorpay.subscription.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1
        });

        // Update user model with subscription!
        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;

        await user.save();

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const verifySubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const User = await user.findById(id);

        if (!User) {
            return next(new AppError('Unauthorized! , Please Login', 500));
        }

        const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(`${razorpay_payment_id}|${razorpay_subscription_id}`);

        if (generatedSignature !== razorpay_signature) {
            return next(new AppError('Payment not verified! , please try again!', 500));
        }

        // Record details in Payment collection!
        await Payment.create({
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature
        })

        // Update user record with subscription status
        User.subscription.status = 'active';
        await User.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully!',
        })

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const User = await user.findById(id);

        if (!User) {
            return next(new AppError('Unauthorized! , Please Login', 500));
        }

        if (User.role === 'ADMIN') {
            return next(new AppError('ADMIN cannot cancel the subscription!', 400));
        }

        const subscriptionId = user.subscription.id;
        const subscription = await razorpay.subscription.cancel({
            subscriptionId
        })

        user.subscription.status = subscription.status;
        await User.save();

        res.status(200).json({
            success: true,
            message: 'Subscription cancelled!'
        })

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const getAllPayments = async (req, res, next) => {
    try {
        const { count } = req.query;

        const subscriptions = await razorpay.subscriptions.all({
            count: count || 10,
        })

        res.status(200).json({
            success: true,
            message: 'All payments',
            payments: subscriptions
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}


export {
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    getAllPayments
}