/**
 * Strict mode
 */ 

'use strict'

/**
 * @description Module depedencies
 */

const mysql = require('mysql');
const { dbHost, dbName, dbUser, dbPass } = require('../app/config');

const conn = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbName
});

module.exports = { conn };