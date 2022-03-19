//* Strict mode
'use strict'

/**
 * @description Module depedencies (...)
 * @module index ...
 * @module config ...
 */

const { conn } = require('../../../database');
const config = require('../../config');

/**
 * @description Module depedencies (...)
 * @module passport authentication middleware 
 * @module jwt ompact URL-safe means of representing claims to be transferred
 * between two parties
 */

const passport = require('passport');
const jwt = require('jsonwebtoken');

/**
 * @description ...
 * @param { Array } email Represents the HTTP Request sent by the user
 * @param { Property } password Represents the HTTP Response that will be given to
 * the user
 * @param { Function } done Close middleware connection
 */

let login = async (req, res, next) => {
    passport.authenticate('local', async (err, user) => {
        if (err) return next(err);

        if (!user) return res.json({
            error: 1, message: 'email or password incorrect'
        });
       
        let signed = jwt.sign(user, config.secretKey);

        await conn.query(
            `UPDATE users SET token = ? WHERE email = ?`,
            [signed, user.email],
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

        return res.json({
            message: 'logged in successfully',
            user: user,
            token: signed
        });
    })(req, res, next);
}

module.exports = { login }