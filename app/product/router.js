'use strict'

const productController = require('./controller');

const router = require('express').Router();
const multer = require('multer');

router.post('/products', multer().none(), productController.store);

module.exports = router;
