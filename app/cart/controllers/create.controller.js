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
const { validation } = require('../../cart-item/model/schema');

let store = async (req, res, next) => {
    let { user, err } = await decodeToken()(req);

    if (!user) {
        return res.json(err);
    }

    let policy = policyFor(user);

    if (!policy.can('create', 'Cart')) {
        return res.json({
            error: 1,
            message: `You're not allowed to perform this action`
        });
    }

    try {
        //const { items } = req.body;
        const payload = req.body;

        //* Payload validation results
        const result = await validation(payload);

        //* Valid or invalid 
        if (result.hasOwnProperty('error')) {
            //* invalid
            return res.json(result);
        }

        //* Change object payload to array
        const validPayload = Object.keys(result).map((_) => result[_]);

        const productId = validPayload[1];

        await conn.query(
            `SELECT * FROM products WHERE id = ?`,
            [productId],
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
            }
        );
           
        await conn.query(
            `INSERT INTO cart_items
            (id_user, id_product, name, qty, price, image_url)
            VALUES ?`,
            [[validPayload]],
            async (err) => {
                // * handle failed query 
                if (err) {
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                return res.json(validPayload);
            }
        );
    } catch (err) {
        // (1) tangani kemungkinan _error_
        if (err && err.name == 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        
        next(err)
    }
}

module.exports = { store };