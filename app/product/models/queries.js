/**
 * Strict mode
 */

'use strict'

/**
 * @description Module depedencies
 * @module database Mysql database connection to access sql query
 */

const { conn } = require('../../../database');

function Queries() {
    this.select =
        `SELECT
        categories.id AS category_id,
        categories.name AS category_name,
        categories.created_at AS category_created_at,
        categories.updated_at AS category_updated_at,
		products.id AS product_id,
        products.name AS product_name,
        products.description AS product_description,
        products.price AS product_price,
        products.image_url AS product_image_url,
        products.created_at AS product_created_at,
        products.updated_at AS product_updated_at
        FROM products 
        JOIN categories 
        ON (products.id_category = categories.id) 
        ORDER BY products.id DESC LIMIT ?, ?`;

    this.productFilter =
        `SELECT
        categories.id AS category_id,
        categories.name AS category_name,
        categories.created_at AS category_created_at,
        categories.updated_at AS category_updated_at,
		products.id AS product_id,
        products.name AS product_name,
        products.description AS product_description,
        products.price AS product_price,
        products.image_url AS product_image_url,
        products.created_at AS product_created_at,
        products.updated_at AS product_updated_at
        FROM products 
        JOIN categories 
        ON (products.id_category = categories.id) 
        WHERE MATCH(products.name)
        AGAINST (? IN NATURAL LANGUAGE MODE)
        ORDER BY products.id DESC LIMIT ?, ?`;

    this.transaction = async function (query) {
        // * start transaction
        return await conn.query(query);
    }

    this.connectionQuery = async function (...args) {
        let [query, payload, asyncFunc] = args;
        return await conn.query(query, payload, asyncFunc);
    }

    this.rollback = async function () {
        // * rollback
        return await conn.rollback(function (err) {
            console.error(`Query failed : ${err}`);
        });
    }

    this.commit = async function (query) {
        // * commit
        return await conn.query(query);
    }
}

module.exports = { Queries };