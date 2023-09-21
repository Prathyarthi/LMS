import express from 'express';
const Router = express.Router();
import { signup, login, logout, getProfile, forgotPassword, resetPassword, changePassword, updateUser } from '../controllers/user.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';


Router.post('/signup', upload.single('avatar'), signup);
Router.post('/login', login);
Router.get('/logout', logout);
Router.get('/me', isLoggedIn, getProfile);
Router.post('/forgot', forgotPassword);
Router.post('/reset/:resetToken', resetPassword);
Router.post('/change-password', isLoggedIn, changePassword);
Router.post('/update', isLoggedIn, upload.single('avatar'), updateUser);


export default Router;