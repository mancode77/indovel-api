/**
 * Strict mode
 */

'use strict'

/**
 * @description Module depedencies
 * @module path Access file or folder pathname
 * @module dotenv Load configuration variables
 */

const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    secretKey: process.env.SECRET_KEY,
    rootPath: path.resolve(__dirname, '..'),
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,

};