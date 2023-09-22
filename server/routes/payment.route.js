import express from 'express';
import { buySubscription, cancelSubscription, getAllPayments, getRazorpayApiKey, verifySubscription } from '../controllers/payment.controller.js';
import { authorizedRoles, isLoggedIn } from '../middleware/auth.middleware.js';

const Router = express.Router();

Router
    .route('/razorpay-key')
    .get(isLoggedIn, getRazorpayApiKey);

Router
    .route('/subscribe')
    .post(isLoggedIn, buySubscription);

Router
    .route('/verify')
    .post(isLoggedIn, verifySubscription);

Router
    .route('/unsubscribe')
    .post(isLoggedIn, cancelSubscription);


Router
    .route('/')
    .get(isLoggedIn, authorizedRoles('ADMIN'), getAllPayments);

export default Router;