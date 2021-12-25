'use strict'

const Joi = require('joi');

// ! role, enum type and default value
// ! token > 1
const userSchema = Joi.object({
    full_name: Joi.string()
        .min(3)
        .max(255)
        .required(),

    customer_id: Joi.number(),

    email: Joi.email()
        .max(255)
        .required(),

    password: Joi.string()
        .max(255)
        .required(),

    role: Joi.string(),

    token: Joi.string()
       
});

module.exports = { useSchema };