// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module joi Object schema and validator
 */

const Joi = require('joi');

const deliveryAddressSchema = Joi.object({
    id_user: Joi.number()
        .integer()
        .required(),

    nama: Joi.string()
        .max(255)
        .required(),

    kelurahan: Joi.string()
        .max(255)
        .required(),

    kecamatan: Joi.string()
        .max(255)
        .required(),

    kabupaten: Joi.string()
        .max(255)
        .required(),

    provinsi: Joi.string()
        .max(255)
        .required(),

    detail: Joi.string()
        .max(255)
        .required() 
});

//* Validation delivery_address
let validation = async (payload) => {
    try {
        payload = { ...payload };

        // * check product structure
        return await deliveryAddressSchema.validateAsync(payload);
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