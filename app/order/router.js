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

router.post('/orders', multer().none(), store);
// (1) definisi router untuk daftar pesanan
router.get('/orders', index);
module.exports = router;