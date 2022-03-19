//* Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module index Mysql database connection to access sql query
 * @module middleware data from user
 */

const { conn } = require('../../../database');
const { decodeToken } = require('../middleware');

/**
 * @description ...
 * @param { Array } email Represents the HTTP Request sent by the user
 * @param { Property } password Represents the HTTP Response that will be given to
 * the user
 * @param { Function } done Close middleware connection
 */

let logout = async (req, res, next) => {
    let { token } = await decodeToken()(req);
    
    await conn.query(
        `SELECT token FROM users WHERE token = ?`,
        [token],
        async (err, rows) => {
            // * handle failed query 
            if (err) {
                console.error({
                    sqlMessage: err.sqlMessage,
                    sql: err.sql
                });
            }

            if (rows.length < 1) {
                return res.json({
                    error: 1,
                    message: 'User tidak ditemukan'
                });
            }

            await conn.query(
                `UPDATE users SET token = ? WHERE token = ?`,
                ['NULL', token],
                async function (err) {
                    // * handle failed query
                    if (err) {
                        // * debug
                        console.error({
                            sqlMessage: err.sqlMessage,
                            sql: err.sql
                        });
                    }

                    return res.json({
                        error: 0,
                        message: 'Logout berhasil'
                    });
                }
            );
        }
    );

}

module.exports = { logout };