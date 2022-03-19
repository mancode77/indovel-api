// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module schema Validate data from user
 * @module database Mysql database connection to access sql query
 */

const router = require('express').Router();
const multer = require('multer');
const { store, index } = require('./controllers/init');

router.post('/carts', multer().none(), store);
// (3) route untuk `update` cart
router.get('/carts', index);
module.exports = router;