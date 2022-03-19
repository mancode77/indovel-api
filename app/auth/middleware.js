// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module index Create product categories
 * @module get-token Update product categories
 * @module config Delete product categories
 */

const { conn } = require('../../database');
const { getToken } = require('./utils/get-token');
const { secretKey } = require('../config');

/**
 * @description Module depedencies
 * @module bcrypt Create product categories
 * @module jwt Update product categories
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @description ...
 * @param { Array } email Represents the HTTP Request sent by the user
 * @param { Property } password Represents the HTTP Response that will be given to
 * the user
 * @param { Function } done Close middleware connection
 */

let decodeToken = () => {
    return async (req) => {
        try {
            let token = getToken(req);

            if (!token) {
                return {
                    err: {
                        error: 1,
                        message: `Token expired`
                    }
                };
            }

            let user = jwt.verify(token, secretKey);

            await conn.query(
                `SELECT full_name, email, role FROM users WHERE token = ?`,
                [token],
                (err, rows) => {
                    //* Error Handler
                    if (err) {
                        // * debug
                        console.error({
                            sqlMessage: err.sqlMessage,
                            sql: err.sql
                        });
                    }

                    if (rows.length < 1) {
                        return {
                            error: 1,
                            message: `Token expired`
                        };
                    }

                    return {
                        user: {
                            ...rows[0]
                        },
                        token
                    }
                }
            );

            return { user, token };
        } catch (err) {
            if (err && err.name === 'JsonWebTokenError') {
                return {
                    error: 1,
                    message: err.message
                };
            }
        }
    }
}

module.exports = { decodeToken };