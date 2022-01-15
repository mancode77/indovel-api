'use strict'

const tagController = require('./controller');
const router = require('express').Router();
const multer = require('multer');

router.post('/tags', multer().none(), tagController.store);
router.put('/tags/:id', multer().none(), tagController.update);
router.delete('/tags/:id', tagController.destroy);

module.exports = router;
