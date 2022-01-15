'use strict'

const { CreateProductController } = require('controllers/product/create.controller')
const { Controller } = require('./../../../core/Controller');

class CreateProductRoute extends Controller {
    constructor() {
        super()
    }
    route() {
        return this.post('/products', (req, res) => new CreateProductController().controller(req, res))
    }
}

module.exports = { CreateProductRoute }
