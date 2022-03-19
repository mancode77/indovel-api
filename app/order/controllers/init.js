// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module create.controller Create product categories
 * @module update.controller Update product categories
 * @module delete.controller Delete product categories
 */

const { store } = require('./create.controller');
const { index } = require('./read.controller');

module.exports = { store, index };