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
const { validation } = require('../models/schema');
const { policyFor } = require('../../policy/index');
const { decodeToken } = require('../../auth/middleware');

// * instance object query sql
let queries = new Queries();

/**
 * @description Create single product
 * @param { object } req Represents the HTTP Request sent by the user
 * @param { object } res Represents the HTTP Response that will be given to
 * the user
 * @param { function } next Close middleware connection
*/

let store = async (req, res, next) => {
    try {
        let { user, err } = await decodeToken()(req);

        if (!user) {
            return res.json(err);
        }
       
        let policy = policyFor(user);
        
        if (!policy.can('create', 'Product')) {
            return res.json({
                error: 1,
                message: `Anda tidak memiliki akses untuk membuat produk`
            });
        }
        
        //* User request data 
        let payload = req.body;

        // * tampung data payload
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

                // * validation peoduct
                const result = await validation(product);

                // * error validation
                if (result.hasOwnProperty('error')) {
                    return res.json(result);
                }

                // * convert to array
                const validProduct =
                    Object.keys(result).map((_) => result[_]);

                // * insert data
                await queries.connectionQuery(
                    `INSERT INTO products
                    (id_category, name, description, price, image_url)
                    VALUES ?`,
                    [[validProduct]],
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
                    `SELECT * FROM products ORDER BY id DESC LIMIT 1`,
                    async (err, rows) => {
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
        //* Error handling by express 
        next(err);
    }
}

module.exports = { store };