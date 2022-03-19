/**
 * Strict mode
 */

'use strict'

/**
 * @description Module depedencies
 */

const { getProvinsi } = require('./get-provinsi.controller');
const { getKabupaten } = require('./get-kabupaten.controller');
const { getKecamatan } = require('./get-kecamatan.controller');
const { getDesa } = require('./get-desa.controller');

module.exports = {
     getProvinsi, 
     getKabupaten, 
     getKecamatan,
     getDesa
};