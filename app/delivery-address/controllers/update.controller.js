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

let update = async (req, res, next) => {
   
    try {
        let { user, err } = await decodeToken()(req);

        if (!user) {
            return res.json(err);
        }

        let policy = policyFor(user);

        if (!policy.can('update', 'DeliveryAddress')) {
            return res.json({
                error: 1,
                message: `You're not allowed to perform this action`
            });
        }

        // * user request data 
        let payload = req.body;

        await conn.query(
            "SELECT * FROM delivery_addresses WHERE id = ? ",
            Number(req.params.id),
            async (err, rows) => {
                // * handle failed query 
                if (err) {
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                // * Data tidak ditemukan
                if (rows?.length < 1) {
                    return res.json({
                        message: 
                            `tag with id ${Number(req.params.id)} not found`
                    });
                }
            }
        );

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

        // * catch id user
        validDeliveryAddress.shift();
        validDeliveryAddress.push(Number(req.params.id));
        
        // * insert category
        await conn.query(
            `UPDATE delivery_addresses SET 
            nama = ?,
            kelurahan = ?,
            kecamatan = ?,
            kabupaten = ?,
            provinsi = ?,
            detail = ? 
            WHERE id = ?`,
            validDeliveryAddress,
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
            "SELECT * FROM delivery_addresses WHERE id = ? ",
            Number(req.params.id),
            async (err, rows) => {
                // * handle failed query 
                if (err) {
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                // * Data tidak ditemukan
                if (rows?.length < 1) {
                    return res.json({
                        message: `tag with id ${Number(req.params.id)} not found`
                    });
                }

                return res.json(rows);
            }
        );
    } catch (err) {
        if (err && err.name == 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

module.exports = { update };