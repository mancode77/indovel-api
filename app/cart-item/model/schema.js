// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module joi Object schema and validator
 */

const Joi = require('joi');

const cartItemSchema = Joi.object({
    id_user: Joi.number()
       .integer(),

    id_product: Joi.number()
        .integer(),

    name: Joi.string()
        .min(5)
        .required(),

    qty: Joi.number()
        .integer()
        .min(1)
        .required(),

    price: Joi.number()
        .integer()
        .default(0)
        .required(),

    image_url: Joi.string(),
});

//* Validation delivery_address
let validation = async (payload) => {
    try {
        payload = { ...payload };
        
        // * check product structure
        return await cartItemSchema.validateAsync(payload);
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