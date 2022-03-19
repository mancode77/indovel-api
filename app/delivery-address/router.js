// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module schema Validate data from user
 * @module database Mysql database connection to access sql query
 */

const router = require('express').Router();
const multer = require('multer');
const { store, update, destroy, index } = require('./controllers/init');

router.post('/delivery-addresses', multer().none(), store);
router.put('/delivery-addresses/:id', multer().none(), update);
router.delete('/delivery-addresses/:id', destroy);
router.get('/delivery-addresses', index);

module.exports = router;