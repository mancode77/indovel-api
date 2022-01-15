'use strict'

const os = require('os');
const http = require('http');
const { app } = require('./src/app');
const { Connection } = require('./src/configs/Connection');
const { Debug } = require('./src/debug/Debug');
const { Route } = require('./src/core/Route');
const { dbConnection } = require('../indovel-api/src/database');

class App extends Route {
  #connection;

  init() {
    // * route
    // app.use(super.init());

    const dbConnectoin = this.#connection.MysqlConnection();

    dbConnection.connect(function (err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }

      console.info('Database Connection Successfuly');

      // const port = Debug.normalizePort(process.env.PORT || '3000');
      // app.set('port', port);

      http.createServer(app).listen(3000);
      // .listen(port)
      // .on('error', Debug.onError)
      // .on('listening', Debug.onListening);
    });
  }

  static onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }

  setConnection(connection) {
    this.#connection = connection;
  }
}

const main = new App();

main.setConnection(new Connection());
main.init();