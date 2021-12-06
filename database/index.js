'use strict'

const mysql = require('mysql');
const {dbHost, dbName, dbPort, dbUser, dbPass} = require('./../app/config');

var connection = mysql.createConnection({
    host     : dbHost,
    user     : dbUser,
    password : dbPass,
    database : dbName
});

module.exports = { connection };