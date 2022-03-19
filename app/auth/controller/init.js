// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module localStrategy ...
 * @module login ...
 * @module register ...
 * @module me .
 * @module logout ...
 */

const { localStrategy } = require('./localstrategy.controller');
const { login } = require('./login.controller');
const { logout } = require('./logout.controller');
const { me } = require('./me.controller');
const { register } = require('./register.controller');


module.exports = { localStrategy, login, register, me, logout };