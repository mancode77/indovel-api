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

let destroy = async (req, res, next) => {
    try {
        let { user, err } = await decodeToken()(req);

        if (!user) {
            return res.json(err);
        }

        let policy = policyFor(user);

        if (!policy.can('delete', 'Product')) {
            return res.json({
                error: 1,
                message: `Anda tidak memiliki akses untuk menghapus produk`
            });
        }

        await conn.query(
            `SELECT * FROM delivery_addresses WHERE id = ?`,
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

                await conn.query(
                    `DELETE FROM delivery_addresses WHERE id = ?`,
                    rows[0].id,
                    async () => {
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

                return res.json(rows);
            });
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

module.exports = { destroy };