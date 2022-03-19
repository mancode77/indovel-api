/**
 * Strict mode
 */

'use strict'

/**
 * @description Module depedencies
 */
const csv = require('csvtojson');
const path = require('path');

let getKabupaten = async (req, res, next) => {
    const db_kabupaten = path.resolve(__dirname,
        './../data/regencies.csv');
    try {
        let { kode_induk } = req.query;

        const data = await csv().fromFile(db_kabupaten);

        if (!kode_induk) return res.json(data);

        return res.json(data.filter(kabupaten => kabupaten.kode_provinsi
            === kode_induk));
    } catch (err) {
        return res.json({
            error: 1,
            message:
                'Tidak bisa mengambil data kabupaten, hubungi administrator'
        });
    }
}

module.exports = { getKabupaten };