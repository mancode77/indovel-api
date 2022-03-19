/**
 * Strict mode
 */

'use strict'

/**
 * @description Module depedencies
 */

const csv = require('csvtojson');
const path = require('path');

let getKecamatan = async (req, res, next) => {
    const db_kecamatan = path.resolve(__dirname, './../data/districts.csv');
    try {
        let { kode_induk } = req.query;

        const data = await csv().fromFile(db_kecamatan);

        if (!kode_induk) return res.json(data);
        
        return res.json(data.filter(kecamatan => kecamatan.kode_kabupaten
            === kode_induk));
    } catch (err) {
        return res.json({
            error: 1,
            message: 
            'Tidak bisa mengambil data kecamatan, hubungi administrator'
        });
    }
}

module.exports = { getKecamatan };