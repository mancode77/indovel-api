// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module queries Mysql query set
 */

const {
    getProvinsi,
    getKabupaten,
    getKecamatan,
    getDesa
} = require('./controllers/init');
const router = require('express').Router();

router.get('/wilayah/provinsi', getProvinsi);
router.get('/wilayah/kabupaten', getKabupaten); 
router.get('/wilayah/kecamatan', getKecamatan); 
router.get('/wilayah/desa', getDesa);

module.exports = router;