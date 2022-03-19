// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module bcrypt Basic password hash algorithm
 * @module joi Object schema and validator
 */

const bcrypt = require('bcrypt');
const Joi = require('joi');

const userSchema = Joi.object({
    full_name: Joi.string()
        .min(3)
        .max(255)
        .required(),

    email: Joi.string()
        .max(255)
        .required(),

    password: Joi.string()
        .max(255)
        .required(),

    role: Joi.string()
        .required(),

    token: Joi.string()
        .max(255)

});

//* Validation user
let validation = async (payload) => {
    try {
        payload.password = bcrypt.hashSync(payload.password, 10);
        
        // * check product structure
        return await userSchema.validateAsync(payload);
    } catch (err) {
        return {
            error: 1,
            product: err._original,
            details_error: {
                message: err.details[0].message
            }
        };
    }
}

module.exports = { validation };