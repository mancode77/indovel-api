'use strict'

const path = require('path');
const cookieParser = require('cookie-parser');
const debug = require('debug')('blog:server');
const dotenv = require('dotenv');
const express = require('express');
const Joi = require('joi');
const logger = require('morgan');
const mysql = require('mysql');

class Module {
  #app;
  #env;

  constructor(app) {
    this.#app = app;
  }

  assets() {
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: false }));
    this.#app.use(cookieParser());
    this.#app.use(express.static(path.join(__dirname, 'public')));
  }

  debug() {
      return debug;
  }

  dotenv() {
    this.#env = dotenv.config()
    return this.#env;
  }
  
  joi() {
    return Joi;
  }

  morgan() {
    this.#app.use(logger('dev'));
  }

  mysql() {
    return mysql;
  }

  template() {
    // * view engine setup
    this.#app.set('views', path.join(__dirname, 'views'));
    this.#app.set('view engine', 'pug');
  }
}

module.exports = { Module };