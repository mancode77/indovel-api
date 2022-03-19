/**
 * Strict mode
 */

'use strict'
/**
 * @description Module depedencies
 */

const { Queries } = require('../models/queries');
const { policyFor } = require('../../policy/index');
const { decodeToken } = require('../../auth/middleware');

// * instance object query sql
let queries = new Queries();

/**
 * @description Reads product
 * @param { object } req Represents the HTTP Request sent by the user
 * @param { object } res Represents the HTTP Response that will be given to
 * the user
 * @param { function } next Close middleware connection
*/

let index = async (req, res, next) =>{
    try {
        let { user, err } = await decodeToken()(req);

        if (!user) {
            return res.json(err);
        }

        let policy = policyFor(user);

        if (!policy.can('read', 'DeliveryAddress')) {
            return res.json({
                error: 1,
                message: `You're not allowed to perform this action`
            });
        }

        let { limit = 10, skip = 0, q = '', category = '' } = req.query;

        // * filter keyword by product
        if (q || category) {
            await queries.connectionQuery(
                queries.productFilter,
                [q, Number(skip), Number(limit)],
                async (err, rows) => {
                    // * handle failed query 
                    if (err) {
                        // * debug
                        console.error({
                            sqlMessage: err.sqlMessage,
                            sql: err.sql
                        });
                    }

                    if (!req.query.hasOwnProperty('category')) {
                        return res.json({
                            data: rows,
                            count: rows.length
                        });
                    }
                }
            );

            await queries.connectionQuery(
                queries.categoryFilter,
                [category, Number(skip), Number(limit)],
                async (err, rows) => {
                    // * handle failed query 
                    if (err) {
                        // * debug
                        console.error({
                            sqlMessage: err.sqlMessage,
                            sql: err.sql
                        });
                    }

                    if (!req.query.hasOwnProperty('tags')) {
                        return res.json({
                            data: rows,
                            count: rows.length
                        });
                    }
                }
            );
        } else {
            await queries.connectionQuery(
                queries.select,
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
        }
    } catch (err) {
        // * error handling by express 
        next(err);
    }
}

module.exports = { index };