// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module router Middleware to create modular, mountable route handlers.
 * @module multer Middleware to handle multipart/form-data
 */

const router = require('express').Router();
const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {
    localStrategy,
    login,
    register,
    me,
    logout
} = require('./controller/init');

passport.use(new LocalStrategy({ usernameField: 'email' }, localStrategy));

router.post('/register', multer().none(), register);
router.post('/login', multer().none(), login);
router.get('/me', me);
router.post('/logout', logout);

module.exports = router;