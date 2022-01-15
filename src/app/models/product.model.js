'use strict'

const { Module } = require('configs/Module');

const productSchema = Joi.object({
  id_category: Joi.number()
    .max(1000)
    .required(),

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
      id_category: Number(payload[0]),
      name: payload[1],
      description: payload[2],
      price: Number(payload[3]),
      image_url: payload[4]
    }

    // * check product structure
    return await productSchema.validateAsync(dataPayload);
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
