'use strict'

const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required(),

    description: Joi.string()
				.max(1000),

    price: Joi.number(),


    image_url: Joi.string()
				.max(100)
				.required(),
});

// * function validation product
async function validation(payload) {
    try {
        const dataPayload = {
            name: payload[0],
            description: payload[1],
            price: Number(payload[2]),
            image_url: payload[3]
        }
       
        // * check product structure
        return await productSchema.validateAsync(dataPayload);
    } catch (err) {
        return err;
        return err.details[0].message;
    }
}

module.exports = { validation };