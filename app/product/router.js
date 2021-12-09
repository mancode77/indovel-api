'use strict'

const os = require('os');

const productController = require('./controller');

const router = require('express').Router();
const multer = require('multer');

router.get('/products', productController.index);
router.post('/products', multer({dest: os.tmpdir()}).single('image_url'), productController.store);
router.put('/products/:id', multer({dest: os.tmpdir()}).single('image_url'), productController.update);

module.exports = router;