'use strict'

const { Module } = require('./Module');

class Connection extends Module {
  #db;

  constructor() {
    super();
    this.#db = this.mysql();
  }

  MysqlConnection() {
    const connection = this.#db.createConnection({
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PORT,
      database : process.env.DB_PASS
    });

    return connection;
  }
}

module.exports = { Connection };