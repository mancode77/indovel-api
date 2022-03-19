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

let index = async (req, res, next) => {
    // let { user, err } = await decodeToken()(req);

    // if (!user) {
    //     return res.json(err);
    // }

    // let policy = policyFor(user);

    // if (!policy.can('read', 'Invoice')) {
    //     return res.json({
    //         error: 1,
    //         message: `You're not allowed to perform this action`
    //     });
    // }

    try {
        let {id, limit = 10, skip = 0 } = req.query;

        await conn.query(
            `SELECT * FROM orders 
            JOIN order_items
            ON (orders.id_order_item = order_items.id)
            WHERE orders.id_user = ? 
            ORDER BY orders.id DESC LIMIT ?, ?`,
            [id, Number(skip), Number(limit)],
            async (err, rows) => {
                // * handle failed query 
                if (err) {
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                return res.json({
                    data: rows,
                    count: rows.length
                });
            }
        );
    } catch (err) {
        if (err && err.name == 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors,
            });
        }

        next(err);
    }

}

module.exports = { index };