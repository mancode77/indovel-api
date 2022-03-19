// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module schema Validate data from user
 * @module database Mysql database connection to access sql query
 */

const { policyFor } = require('../../policy/index');
const { decodeToken } = require('../../auth/middleware');
const { conn } = require('../../../database');
const { validation } = require('../model/schema');

let store = async (req, res, next) => {
    try {
        let { user, err } = await decodeToken()(req);

        if (!user) {
            return res.json(err);
        }
        
        let policy = policyFor(user);

        if (!policy.can('create', 'DeliveryAddress')) {
            return res.json({
                error: 1,
                message: `You're not allowed to perform this action`
            });
        }

        let payload = req.body;
       
        // * check schema
        // * validation Category
        const result = await validation(payload);
      
        // * error validation
        if (result.hasOwnProperty('error')) {
            return res.json(result);
        }

        // * konversion object to array
        const validDeliveryAddress = 
            Object.keys(result).map((_) => result[_]);
       
        await conn.query(
            `INSERT INTO delivery_addresses 
            (id_user, nama, kelurahan, kecamatan, kabupaten, provinsi, detail)
            VALUES ?`,
            [[validDeliveryAddress]],
            async (err) => {
                // * handle failed query 
                if (err) {
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }
            }
        );

        await conn.query(
            `SELECT * FROM delivery_addresses ORDER BY id DESC LIMIT 1`,
            async (err, rows) => {
                //* handle failed query 
                if (err) {
                    //* debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                return res.json(rows);
            }
        );
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        
        next(err);
    }
}

module.exports = { store };