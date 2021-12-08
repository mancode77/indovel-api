'use strict'

const path = require('path');
const productRouter = require('./app/product/router');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// * router api
app.use('/api', productRouter);

// * tangkap 404 dan teruskan ke penangan kesalahan 
app.use(function(req, res, next) {
    next(createError(404));
});

// * penangan kesalahan 
app.use(function(err, req, res, next) {
     // * atur lokal, hanya memberikan kesalahan dalam pengembangan 
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // * render halaman kesalahan 
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;