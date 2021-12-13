'use strict'

const http = require('http');
const app = require('./../app');
const { dbConnection } = require('./../database');
const debug = require('debug')('indovel:server');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

dbConnection.connect(function(err) {
    // * Tangkap error koneksi DB
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    // * Connection successful 
    server.listen(port);
    server.on('error', onError); 
    server.on('listening', onListening);
});

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
    // * pipe name
        return val;
    }

    if (port >= 0) {
    // *  port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

  // * handle specific listening errors with friendly messages 
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

// * Event listener for HTTP Server "listen" event. 
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}