/**
 * Strict mode
 */

'use strict'

/**
 * @description Module depedencies
 */

const csv = require('csvtojson');
const path = require('path');

let getProvinsi = async (req, res, next) => {
    const db_provinsi = path.resolve(__dirname, './../data/provinces.csv');
    try {
        const data = await csv().fromFile(db_provinsi);
        
        return res.json(data);
    } catch (err) {
        return res.json({
            error: 1,
            message: 
            'Tidak bisa mengambil data provinsi, hubungi administrator'
        });
    }
}
module.exports = { getProvinsi };