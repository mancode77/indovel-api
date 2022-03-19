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

 let index = async (req, res, next) => {
    try {
        let { user, err} = await decodeToken()(req);

        if(!user) {
            return res.json(err);
        }
        
        let policy = policyFor(user);

        if (!policy.can('read', 'DeliveryAddress')) {
            return res.json({
                error: 1,
                message: `You're not allowed to perform this action`
            });
        }

        let { limit = 10, skip = 0 } = req.query;

        await conn.query(
            `SELECT * FROM delivery_addresses ORDER BY id DESC LIMIT ?, ?`,
            [Number(skip), Number(limit)],
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
                fields: err.errors
            })
        }

        next(err)
    }
}

module.exports = { index };