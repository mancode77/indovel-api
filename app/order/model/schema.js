// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module joi Object schema and validator
 */

const Joi = require('joi');

const orderSchema = Joi.object({
    id_user: Joi.number()
        .integer()
        .required(),

    id_order_item: Joi.number()
        .integer()
        .required(),

    id_delivery_address: Joi.number()
        .integer()
        .required(),

    status: Joi.string()
        .max(255)
        .required(),

    delivery_fee: Joi.number()
        .integer()
        .required(),
});

//* Validation delivery_address
let validation = async (payload) => {
    try {
        payload = { ...payload };
        
        // * check product structure
        return await orderSchema.validateAsync(payload);
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