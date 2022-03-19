// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module create.controller Create product categories
 * @module update.controller Update product categories
 * @module delete.controller Delete product categories
 */

let getToken = (req) => {
    let token = req.headers.authorization
            ? req.headers.authorization.replace('Bearer ', '')
            : null;

    return token && token.length ? token : null;
}
module.exports = { getToken };