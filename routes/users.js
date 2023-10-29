const express = require('express');
const router = express.Router(); 
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const userController = require('../controllers/users');

const { storeReturnTo } = require('../middleware')

router.route('/register')
    .get(userController.registerForm)
    .post(catchAsync(userController.register))

router.route('/login')
    .get(userController.loginForm)
    .post(storeReturnTo, passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login' 
    }), catchAsync(userController.login))

router.get('/logout', userController.logout);

module.exports = router;