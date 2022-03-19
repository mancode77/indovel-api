// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module schema Validate data from user
 * @module database Mysql database connection to access sql query
 */

const { conn } = require('../../../database');
const { validation } = require('../model/schema');

let storeInvoice = async (validOrder) => {
    try {
        const [
            id_user,
            id_order,
            id_delivery_address,
            status,
            delivery_fee
        ] = validOrder;
       
        await conn.query(
            `SELECT 
            order_items.price AS price, 
            order_items.qty AS qty ,
            orders.id AS id_order
            FROM order_items 
            JOIN orders 
            ON (order_items.id = orders.id_order_item)`,
            async (err, rows) => {
                if (err) {
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                let sub_total = rows.reduce((sum, item) => sum +=
                    (item.price * item.qty), 0);
                let total = sub_total + delivery_fee

                const invoice = {
                    id_user: id_user,
                    id_order: rows[0].id_order,
                    id_delivery_address: id_delivery_address,
                    sub_total: sub_total,
                    delivery_fee: delivery_fee,
                    total: total,
                    payment_status: status
                }

                const result = await validation(invoice);

                // * error validation
                if (result.hasOwnProperty('error')) {
                    return result;
                }

                const validInvoice =
                    Object.keys(result).map((_) => result[_]);

                await conn.query(
                    `INSERT INTO invoices 
                    (id_user, id_order, id_delivery_address, 
                    sub_total, delivery_fee, total, payment_status) 
                    VALUES ?`,
                    [[validInvoice]],
                    async (err) => {
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

module.exports = { storeInvoice }