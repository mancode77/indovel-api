'use strict'

const express = require('express');
const app = express();

app.use(express.json());

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