'use strict'

const Joi = require('joi');

const tagSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .required(),
});

module.exports = { tagSchema };