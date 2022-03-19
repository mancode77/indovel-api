/**
 * Strict mode
 */

'use strict'

/**
 * @description Module depedencies
 */

const csv = require('csvtojson');
const path = require('path');

let getDesa = async (req, res, next) => {
    try {
        const db_desa = path.resolve(__dirname, './../data/villages.csv');

        let { kode_induk } = req.query;

        const data = await csv().fromFile(db_desa);
        
        if (!kode_induk) return res.json(data)
        
        return res.json(data.filter(desa => desa.kode_kecamatan ===
            kode_induk));
    } catch (err) {
        return res.json({
            error: 1,
            message: 'Tidak bisa mengambil data desa, hubungi administrator'
        });
    }
}

module.exports = { getDesa };