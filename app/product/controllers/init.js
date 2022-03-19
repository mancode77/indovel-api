/**
 * Strict mode
 */

'use strict'

/**
 * @description Module depedencies
 * @module create.controller Create product
 * @module read.controller Reads product
 * @module update.controller Update product
 * @module delete.controller Delete product
 */

const { store } = require('./create.controller');
const { index } = require('./read.controller');
const { update } = require('./update.controller');
const { destroy } = require('./delete.controller');

module.exports = { store, index, update, destroy };