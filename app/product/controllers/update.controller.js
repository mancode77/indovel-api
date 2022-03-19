/**
 * Strict mode
 */

'use strict'

/**
 * @description Module depedencies
 */

const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { Queries } = require('../models/queries');
const { validation } = require('../models/schema');
const { policyFor } = require('../../policy/index');
const { decodeToken } = require('../../auth/middleware');

// * instance object query sql
let queries = new Queries();

/**
 * @description Update single product
 * @param { object } req Represents the HTTP Request sent by the user
 * @param { object } res Represents the HTTP Response that will be given to
 * the user
 * @param { function } next Close middleware connection
*/

let update = async (req, res, next) => {
    try {
        let { user, err } = await decodeToken()(req);

        if (!user) {
            return res.json(err);
        }
       
        let policy = policyFor(user);

        if (!policy.can('update', 'Product')) {
            return res.json({
                error: 1,
                message: `Anda tidak memiliki akses untuk mengupdate produk`
            });
        }

        // * user request data 
        let payload = req.body;

        // * accommodate data payload
        const newPayload = [];

        // * fetch attributes from payload
        for (let key in payload) {
            newPayload.push(payload[key]);
        }

        // * check whether to make a file request
        if (req.file) {
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split(".")[
                req.file.originalname.split(".").length - 1];
            let filename = `${req.file.filename}.${originalExt}`;
            let target_path = path.resolve(
                config.rootPath,
                `public/upload/${filename}`
            );

            // * read files that are still in a temporary location
            let src = fs.createReadStream(tmp_path);
            // *  move files to a permanent location
            let dest = fs.createWriteStream(target_path);
            // *  start moving files from `src` to `dest`
            src.pipe(dest);

            src.on("end", async () => {
                let product = [...newPayload, filename];

                // * push id on last element of product array
                product.push(Number(req.params.id));

                await queries.connectionQuery(
                    "SELECT * FROM products WHERE id = ? ",
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

                        // * absoulte path
                        let currentImage = 
                            `${config.rootPath}/public/upload/${rows[0].image_url}`;

                        // * cek absolute path
                        if (fs.existsSync(currentImage)) {
                            fs.unlinkSync(currentImage);
                        }
                    }
                );

                // * validation peoduct
                const result = await validation(product);

                // * error validation
                if (result.hasOwnProperty('error')) {
                    return res.json(result);
                }

                // * convert to array
                const validProduct = Object.keys(result).map((_) => result[_]);

                validProduct.push(Number(req.params.id));

                // * update data
                await queries.connectionQuery(
                    `UPDATE products SET 
                        id_category = ?,
                        name = ?,   
                        description = ?, 
                        price = ?, 
                        image_url = ?
                        WHERE id = ?`,
                    validProduct,
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

                await queries.connectionQuery(
                    `SELECT * FROM products
                    WHERE id = ?`,
                    validProduct.pop(),
                    async (err, rows) => {
                        // * handle failed query 
                        // * handle failed query 
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
            });

            src.on("error", async (err) => {
                next(err);
            });
        } else {
            return res.json({
                error: 1,
                message: 'Harus menggunakan gambar'
            });
        }
    } catch (err) {
        // * error handling by express 
        next(err);
    }
}

module.exports = { update };