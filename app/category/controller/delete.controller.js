// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module schema Validate data from user
 * @module database Mysql database connection to access sql query
 */

const { conn } = require('../../../database');
const { policyFor } = require('../../policy/index');
const { decodeToken } = require('../../auth/middleware');

/**
 * @description Delete single category
 * @param { object } req Represents the HTTP Request sent by the user
 * @param { object } res Represents the HTTP Response that will be given to
 * the user
 * @param { function } next Close middleware connection
*/

let destroy = async (req, res, next) => {
    try {
        let { user, err } = await decodeToken()(req);

        if (!user) {
            return res.json(err);
        }

        let policy = policyFor(user);

        if (!policy.can('delete', 'Category')) { 
            return res.json({
                error: 1,
                message: `Anda tidak memiliki akses untuk menghapus kategori`
            });
        }

        await conn.query(
            `SELECT * FROM categories WHERE id = ?`,
            Number(req.params.id),
            async (err, rows) => {
                //* Handle failed query 
                if (err) {
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                //* Data checking
                if (rows?.length < 1) {
                    return res.json({
                        message: 
                            `tag with id ${Number(req.params.id)} not found`
                    });
                }

                //* Select category by id
                await conn.query(
                    `SELECT * FROM products WHERE id_category = ?`,
                    rows[0].id,
                    async (err, rows) => {
                        if (err) {
                            console.error({
                                sqlMessage: err.sqlMessage,
                                sql: err.sql
                            });
                        }

                        //* Data checking
                        if (rows?.length > 0) {
                            await conn.query(
                                `DELETE FROM products WHERE id_category = ?`,
                                rows[0].id_category,
                                async function (err) {
                                    if (err) {
                                        console.error({
                                            sqlMessage: err.sqlMessage,
                                            sql: err.sql
                                        });
                                    }
                                }
                            );
                        }
                    }
                );

                await conn.query(
                    `DELETE FROM categories WHERE id = ?`,
                    rows[0].id,
                    async (err) => {
                        if (err) {
                            console.error({
                                sqlMessage: err.sqlMessage,
                                sql: err.sql
                            });
                        }
                    }
                );

                return res.json(rows);
            }
        );
    } catch (err) {
        // * error handling by express
        next(err);
    }
}

module.exports = { destroy };