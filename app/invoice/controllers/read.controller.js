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

let show = async (req, res, next) => {
    let { user, err } = await decodeToken()(req);

    if (!user) {
        return res.json(err);
    }

    let policy = policyFor(user);

    if (!policy.can('read', 'Invoice')) {
        return res.json({
            error: 1,
            message: `You're not allowed to perform this action`
        });
    }

    try {
        let { order_id } = req.params;

        await conn.query(
            `SELECT 
            invoices.id AS id,
            invoices.id_user AS id_user,
            invoices.id_order AS id_order,
            invoices.id_delivery_address AS id_delivery_address,
            invoices.sub_total AS sub_total,
            invoices.delivery_fee AS delivery_fee,
            invoices.total AS total,
            invoices.payment_status AS payment_status,
            users.full_name AS full_name,
            users.email AS email,
            invoices.created_at AS created_at,
            invoices.updated_at AS updated_at
            FROM invoices
            JOIN orders
            ON (invoices.id_order = orders.id)
            JOIN users 
            ON (invoices.id_user = users.id)
            WHERE orders.id = ?`,
            order_id,
            async (err, rows) => {
                if (err) {
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                return res.json(rows);
            }
        );
    } catch (err) {
        return res.json({
            error: 1,
            message: `Error when getting invoice.`
        });
    }
}

module.exports = { show };