const express = require('express');
const router = express.Router();
const passport = require('passport');
const { validateLogin, validateSignUp } = require('../middlewares');

//REGISTER
router.post(
    '/signup',
    validateSignUp,
    passport.authenticate('local-signup', {
        successRedirect: '/mywallet',
        failureRedirect: '/error',
        failureFlash: true,
    })
);

//LOGIN
router.post(
    '/login',
    validateLogin,
    passport.authenticate('local-login', {
        successRedirect: '/mywallet',
        failureRedirect: '/error',
        failureFlash: true,
    })
);

// LOGOUT
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/');
});

//ERROR
router.get('/error', (req, res) => {
    res.render('error');
});
module.exports = router;
