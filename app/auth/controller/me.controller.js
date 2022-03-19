//* Strict mode
'use strict'

const { use } = require('passport');
/**
 * @description Module depedencies
 * @module middleware Validate data from user
 */

const { decodeToken } = require('../middleware');

/**
 * @description ...
 * @param { Array } email Represents the HTTP Request sent by the user
 * @param { Property } password Represents the HTTP Response that will be given to
 * the user
 * @param { Function } done Close middleware connection
 */

let me = async (req, res, next) => {
    let { user } = await decodeToken()(req);
    
    if (!user) {
        console.info('ok');
        return res.json({
            error: 1,
            message: `Your're not login or token expired`
        });
    }

    return res.json(user);
}

module.exports = { me };