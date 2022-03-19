//* Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module index ...
 */

const { conn } = require('../../../database');

/**
 * @description Module depedencies
 * @module bcrypt ...
 */

const bcrypt = require('bcrypt');

/**
 * @description ...
 * @param { Array } email Represents the HTTP Request sent by the user
 * @param { Property } password Represents the HTTP Response that will be given to
 * the user
 * @param { Function } done Close middleware connection
 */

let localStrategy = async (email, password, done) => {
    try {
        await conn.query(
            `SELECT full_name, email, password, role 
            FROM users WHERE email = ?`,
            [email],
            async (err, rows) => {
                // * handle failed query 
                if (err) {
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                if (rows.length < 1) return done();

                if (bcrypt.compareSync(password, rows[0].password)) {
                    const { password, ...userWithoutPassword } = rows[0];

                    return done(null, userWithoutPassword);
                }
            }
        );
    } catch (err) {

        done(err, null);
    }
}

module.exports = { localStrategy };