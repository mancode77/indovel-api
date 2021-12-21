'use strict'

const categoryController = require('./controller');
const router = require('express').Router();
const multer = require('multer');

router.post('/categories', multer().none(), categoryController.store);
router.put('categories/:id', multer().none(), categoryController.update);
router.delete('/categories/:id',categoryController.destroy);

module.exports = router;
