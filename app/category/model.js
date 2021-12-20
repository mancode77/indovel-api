'use strict'

const Joi = require('joi');

const categorySchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .required(),
});

module.exports = { categorySchema };