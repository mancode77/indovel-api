'use strict'

class Debug {
    static normalizePort(val) {
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

    static onError(error) {
      if (error.syscall !== 'listen') {
          throw error;
      }

      const bind = typeof port === 'string'
          ? 'Pipe ' + port
          : 'Port ' + port;

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
}

module.exports = { Debug }