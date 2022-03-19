//* Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module index Mysql database connection to access sql query
 * @module model from user
 */

const { conn } = require('../../../database');
const { validation } = require('../../user/model');

/**
 * @description ...
 * @param { Array } email Represents the HTTP Request sent by the user
 * @param { Property } password Represents the HTTP Response that will be given to
 * the user
 * @param { Function } done Close middleware connection
 */

let register = async (req, res, next) => {
    try {
        const payload = req.body;

        //* Validation user
        const result = await validation(payload);

        //* Convert to array
        const validUser = Object.keys(result).map((_) => result[_]);

        //* Insert user
        await conn.query(
            `INSERT INTO users 
            (full_name, email, password, role) 
            VALUES ?`,
            [[validUser]],
            async (err) => {
                //* Handle failed query 
                if (err) {
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }
            }
        );

        await conn.query(
            `SELECT * FROM users ORDER BY id DESC LIMIT 1`,
            async (err, rows) => {
                // * handle failed query 
                if (err) {
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                return res.json(rows);
            }
        );
    } catch (err) {
        //* Error handling by express 
        next(err);
    }
}

module.exports = { register };