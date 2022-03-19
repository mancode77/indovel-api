// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module schema Validate data from user
 * @module database Mysql database connection to access sql query
 */

const { policyFor } = require('../../policy/index');
const { decodeToken } = require('../../auth/middleware');
const { conn } = require('../../../database');
const { validation } = require('../model/schema');
const { storeInvoice } = 
    require('./../../invoice/controllers/create.controller');

let store = async (req, res, next) => {
    let { user, err } = await decodeToken()(req);

    if (!user) {
        return res.json(err);
    }

    let policy = policyFor(user);

    if (!policy.can('create', 'Order')) {
        return res.json({
            error: 1,
            message: `You're not allowed to perform this action`
        });
    }

    if (!policy.can('create', 'Invoice')) {
        return res.json({
            error: 1,
            message: `You're not allowed to perform this action`
        });
    }

    try {
        let payload = req.body;

        // * check schema
        // * validation Category
        const result = await validation(payload);

        // * error validation
        if (result.hasOwnProperty('error')) {
            return res.json(result);
        }

        // * konversion object to array
        const validOrder = 
            Object.keys(result).map((_) => result[_]);

        const newOrderItem = [];

        await conn.query(
            `SELECT * FROM cart_items
            JOIN products 
            ON(cart_items.id_product = products.id)
            WHERE id_user = ?`,
            validOrder[0],
            async (err, rows) => {
                // * handle failed query 
                if (err) {
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                if (!rows.length) {
                    return res.json({
                        error: 1,
                        message: 
                            `Can not create order because you have no items incart`
                    });
                }

                const { id_product, name, qty, price } = rows[0];

                newOrderItem.push(Number(id_product));
                newOrderItem.push(name);
                newOrderItem.push(Number(qty));
                newOrderItem.push(Number(price));

                await conn.query(
                    `INSERT INTO order_items 
                    (id_product, name, qty, price)
                     VALUES ?`,
                    [[newOrderItem]],
                    async (err, rows) => {
                        // * handle failed query 
                        if (err) {
                            // * debug
                            console.error({
                                sqlMessage: err.sqlMessage,
                                sql: err.sql
                            });
                        }
                    }
                );
            }
        );

        await conn.query(
            `SELECT * FROM delivery_addresses WHERE id = ?`,
            validOrder[0],
            async (err, rows) => {
                // * handle failed query 
                if (err) {
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                if (!rows.length) {
                    return res.json({
                        error: 1,
                        message: 
                            `Can not create order because you have no items incart`
                    });
                }
            }
        );

        await conn.query(
            `INSERT INTO orders 
            (id_user, id_order_item, 
            id_delivery_address, status, delivery_fee)
             VALUES ?`,
            [[validOrder]],
            async (err, rows) => {
                // * handle failed query 
                if (err) {
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }
            }
        );

        await storeInvoice(validOrder);
       
        await conn.query(
            `DELETE FROM cart_items WHERE id_user = ?`,
            validOrder[0],
            async (err) => {
                // * handle failed query 
                if (err) {
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }
              
                return res.json(result);
            }
        );
    } catch (err) {
        if (err && err.name == 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

module.exports = { store };