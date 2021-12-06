'use strict'

const http = require('http');
const app = require('./../app');
const { connection } = require('./../database');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

connection.connect(function(err) {
    // * Tangkap error koneksi DB
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    // * Koneksi berhasil 
    server.listen(port);
    server.on('error', onError); 
    console.log(`Server running at http://127.0.0.1:${port}`);   
});



function normalizePort(val) {
    const port = parseInt(val, 10);

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

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
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