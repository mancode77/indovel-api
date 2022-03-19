// * Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module schema Validate data from user
 * @module fs Access file system
 * @module path Access file or folder pathname
 * @module config Create mysql connection
 * @module queries Mysql query set
 */

const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { Queries } = require('../models/queries');
const { policyFor } = require('../../policy/index');
const { decodeToken } = require('../../auth/middleware');

// * instance object query sql
let queries = new Queries();

/**
 * @description Delete single product
 * @param { object } req Represents the HTTP Request sent by the user
 * @param { object } res Represents the HTTP Response that will be given to
 * the user
 * @param { function } next Close middleware connection
*/

let destroy = async (req, res, next) => {
    try {
        let { user, err } = await decodeToken()(req);

        if (!user) {
            return res.json(err);
        }

        let policy = policyFor(user);

        if (!policy.can('delete', 'Product')) {

            return res.json({
                error: 1,
                message: `Anda tidak memiliki akses untuk menghapus produk`
            });
        }

        await queries.connectionQuery(
            `SELECT * FROM products WHERE id = ?`,
            Number(req.params.id),
            async (err, rows) => {
                // * handle failed query 
                if (err) {
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql
                    });
                }

                if (rows.length > 0) {
                    // * absoulte path
                    let currentImage =
                        `${config.rootPath}/public/upload/${rows[0].image_url}`;

                    // * check absolute path
                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage);
                    }

                    await queries.connectionQuery(
                        `DELETE FROM products WHERE id = ?`,
                        rows[0].id,
                        async () => {
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

                return res.json(rows);
            });
    } catch (err) {
        // * error handling by express 
        next(err);
    }
}

module.exports = { destroy };