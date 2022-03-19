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
 * @description Create single category
 * @param { object } req Represents the HTTP Request sent by the user
 * @param { object } res Represents the HTTP Response that will be given to
 * the user
 * @param { function } next Close middleware connection
 */

let store = async (req, res, next) => {
    try {
        let { user, err } = await decodeToken()(req);

        if (!user) {
            return res.json(err);
        }

        let policy = policyFor(user);
       
        if (!policy.can('create', 'Category')) { 
            return res.json({
                error: 1,
                message: `Anda tidak memiliki akses untuk membuat kategori`
            });
        }

        //* Payload
        let payload = req.body;

        //* Payload validation results
        const result = await validation(payload);

        //* Valid or invalid 
        if (result.hasOwnProperty('error')) {
            //* invalid
            return res.json(result);
        }

        //* Change object payload to array
        const validCategory = Object.keys(result).map((_) => result[_]);

        //* Insert category
        await conn.query(
            `INSERT INTO categories (name) VALUES ?`,
            [[validCategory]],
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

        //* Select category
        await conn.query(
            "SELECT * FROM categories ORDER BY id DESC LIMIT 1",
            async (err, rows) => {
                //* Handle failed query 
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

module.exports = { store };