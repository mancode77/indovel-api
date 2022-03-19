/**
 * Strict mode
 */

'use strict'

/**
 * @description Module depedencies
 */

var http = require('http');
var app = require('../app');
const { conn } = require('../database');
var debug = require('debug')('indovel-api:server');

/**
 * Normalize a port into a number, string, or false.
 */

let normalizePort = (val) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

let onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

let onListening = () => {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

// * database connection

conn.connect(function (err) {
    // * Catch DB connection error
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    /**
    * Listen on provided port, on all network interfaces.
    */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
});