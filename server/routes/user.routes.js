const express = require('express');
const Router = express.Router();
const { signup, login, logout, getProfile } = require('../controllers/user.controller');
const { isLoggedIn } = require('../middleware/auth.middleware');

Router.post('/signup', signup);
Router.post('/login', login);
Router.get('/logout', logout);
Router.get('/me', isLoggedIn, getProfile);

module.exports = Router;