'use strict'

const Joi = require('joi');

const categorySchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .required()
});

// * function validation product
async function validation(payload) {
    try {
        // * check product structure
        payload = {...payload};
       
        return await categorySchema.validateAsync(payload);
    } catch (err) {
        return { 
            error: 1,
            tag: err._original, 
            details_error: {
                message: err.details[0].message
            } 
        };
    }
}

module.exports = { validation };