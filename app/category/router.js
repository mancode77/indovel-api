// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module init Multiple module initialization
 * @module router Middleware to create modular, mountable route handlers.
 * @module multer Middleware to handle multipart/form-data
 */

const categoryController = require('./controller/init');
const router = require('express').Router();
const multer = require('multer');

router.post('/categories', multer().none(), categoryController.store);
router.put('/categories/:id', multer().none(), categoryController.update);
router.delete('/categories/:id', categoryController.destroy);

module.exports = router;