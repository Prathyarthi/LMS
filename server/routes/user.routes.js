import express from 'express';
const Router = express.Router();
import { signup, login, logout, getProfile, forgotPassword, resetPassword } from '../controllers/user.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

Router.post('/signup', upload.single('avatar'), signup);
Router.post('/login', login);
Router.get('/logout', logout);
Router.get('/me', isLoggedIn, getProfile);
Router.get('/forgot', forgotPassword);
Router.get('/reset/:resetToken', resetPassword);

export default Router;