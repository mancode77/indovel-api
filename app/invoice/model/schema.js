// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module joi Object schema and validator
 */

const Joi = require('joi');

const invoiceSchema = Joi.object({
    id_user: Joi.number()
        .integer()
        .required(),

    id_order: Joi.number()
        .integer()
        .required(),

    id_delivery_address: Joi.number()
        .integer()
        .required(),

    sub_total: Joi.number()
        .integer()
        .required(),

    delivery_fee: Joi.number()
        .integer()
        .required(),

    total: Joi.number()
        .integer()
        .required(),

    payment_status: Joi.string()
        .required()
});

//* Validation delivery_address
let validation = async (payload) => {
    try {
        payload = { ...payload };
        
        // * check product structure
        return await invoiceSchema.validateAsync(payload);
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