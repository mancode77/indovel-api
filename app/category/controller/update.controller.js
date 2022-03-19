// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module schema Validate data from user
 * @module database Mysql database connection to access sql query
 */

const { validation } = require('../model/schema');
const { conn } = require('../../../database');
const { policyFor } = require('../../policy/index');
const { decodeToken } = require('../../auth/middleware');

/**
 * @description Update single category
 * @param { object } req Represents the HTTP Request sent by the user
 * @param { object } res Represents the HTTP Response that will be given to
 * the user
 * @param { function } next Close middleware connection
*/

let update = async (req, res, next) => {
    try {
        let { user, err } = await decodeToken()(req);

        if (!user) {
            return res.json(err);
        }

        let policy = policyFor(user);

        if (!policy.can('update', 'Category')) {
            return res.json({
                error: 1,
                message: `Anda tidak memiliki akses untuk mengupdate kategori`
            });
        }

        // * user request data 
        let payload = req.body;
        
        await conn.query(
            `SELECT * FROM categories WHERE id = ?`,
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
        const validCategory = Object.keys(result).map((_) => result[_]);
      
        // * catch id user
        validCategory.push(Number(req.params.id));

        // * insert category
        await conn.query(
            `UPDATE categories SET name = ? WHERE id = ?`,
            validCategory,
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
            `SELECT * FROM categories WHERE id = ?`,
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

                return res.json(rows);
            }
        );
    } catch (err) {
        // * error handling by express 
        next(err);
    }
}

module.exports = { update };