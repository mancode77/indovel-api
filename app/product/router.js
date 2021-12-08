'use strict'

const os = require('os');

const productController = require('./controller');

const router = require('express').Router();
const multer = require('multer');

router.post('/products', multer({dest: os.tmpdir()}).single('url_gambar'), productController.store);

module.exports = router;