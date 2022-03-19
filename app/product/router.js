/**
 * Strict mode
 */

'use strict'

/**
 * @description Module depedencies
 * @module os Provides information about the operating system
 * @module init Multiple module initialization
 * @module router Middleware to create modular, mountable route handlers.
 * @module multer Middleware to handle multipart/form-data
 */

const os = require('os');
const productController = require('./controllers/init');
const router = require('express').Router();
const multer = require('multer');

router.get('/products', productController.index);
router.post(
    '/products', 
    multer({ dest: os.tmpdir() }).single('image_url'),
    productController.store
);
router.put(
    '/products/:id', 
    multer({ dest: os.tmpdir() }).single('image_url'), 
    productController.update
);
router.delete('/products/:id', productController.destroy);

module.exports = router;