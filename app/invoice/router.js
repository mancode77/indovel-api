// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module schema Validate data from user
 * @module database Mysql database connection to access sql query
 */

const router = require('express').Router();
const { show } = require('./controllers/init');

router.get('/invoices/:order_id', show);

module.exports = router;