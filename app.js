/**
 * Strict mode
 */

'use strict'

/**
 * @description Module depedencies
 */

const path = require('path');
const productRouter = require('./app/product/router');
const categoryRouter = require('./app/category/router');
const authRouter = require('./app/auth/router');
const wilayahRouter = require('./app/wilayah/router');
const deliveryRouter = require('./app/delivery-address/router');
const cartRouter = require('./app/cart/router');
const orderRouter = require('./app/order/router');
const invoiceRouter = require('./app/invoice/router');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { strict } = require('assert');

const app = express();

/**
 * View engine setup
 */  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

/**
 * Router api
 */
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/auth', authRouter);
app.use('/api', wilayahRouter);
app.use('/api', deliveryRouter);
app.use('/api', cartRouter);
app.use('/api', orderRouter);
app.use('/api', invoiceRouter);

/**
 * Catch 404 and pass to error handler 
 */ 
app.use((req, res, next) => {
  next(createError(404));
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  /** 
   * Atur lokal, hanya memberikan kesalahan dalam pengembangan 
   */ 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /**
   * page rendering error
   */
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;