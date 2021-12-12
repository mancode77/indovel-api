'use strict'

const fs = require('fs');
const path = require('path');
const { Query } = require('./model');
const { connection } = require('./../../database');
const config = require('./../config');

// * instance object query sql
let query = new Query();

async function store(req, res, next) {
    try{
        // * user request data 
        let payload = req.body;
        // * tampung data payload
        const dataPayload = [];
        
        // * fetch attributes from payload 
        for(let key in payload) {
            dataPayload.push(payload[key]);
        }

        // * start transaction
        // ! UJI COBA
        await query.transaction();

        // * check whether to make a file request 
        if(req.file) {
            let tmp_path = req.file.path;
            let originalExt =
                req.file.originalname.split(".")[
                req.file.originalname.split(".").length - 1
                ];
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
                let product = [...dataPayload, filename];

                /**
                 * ! check connection query 
                 * ! if true, return data
                 * ! if false, return error
                 */

                //! make a function for the query, because it is used over and over 
                //  * insert data
                // ! UJI COBA
                await query.connectionQuery(
                    query.sqlQuery(`
                        INSERT INTO products
                        (name, description, price, image_url)
                        VALUES ?
                    `),
                    [[product]], 
                    async function(err, rows) {
                        // * handle failed query 
                        if(err) {
                            // * rollback
                            query.rollback();

                            //! error handling (temporary) 
                            return res.json({
                                error: 1,
                                message: err.sqlMessage,
                            });
                        }
                });

               
                // ! select data to find out the data entered by the user (temporarily) 
                // ! UJI COBA
               await query.connectionQuery(
                    query.sqlQuery("SELECT * FROM products ORDER BY id DESC LIMIT 1"), 
                     async function(err, rows) {
                        // * handle failed query 
                        if(err) {
                            // * rollback
                            query.rollback();
                        } 
                        return res.json(rows);
                });
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

        // * commit
        // ! UJI COBA
        await query.commit();
    }catch (err) {
        /**
        * ! The handler can't be used
        * ! Need a decorator!!... 
         */
        // * check error type 
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        // * error handling by express 
        next(err);
    }
}

async function index(req, res, next) {
    try {

        let { limit = 10, skip = 0 } = req.query;

        // * start transaction
        await query.transaction();

        // ! select data to find out the data entered by the user (temporarily) 
        await query.connectionQuery(
            //! Binding limit and skip
            query.sqlQuery(`SELECT * FROM products ORDER BY id DESC LIMIT ${Number(skip)}, ${Number(limit)}`),
            async function(err, rows) {
                // * handle failed query 
                if(err) {
                    // * rollback
                    query.rollback();
                } 
                
                return res.json(rows);
        });
        
        // * commit
        await query.commit();
    }catch(err) {
         // * error handling by express 
        next(err);
    }
}

async function update(req, res, next) {
    try{
        // * user request data 
        let payload = req.body;
        // * tampung data payload
        const dataPayload = [];

        // * fetch attributes from payload 
        for(let key in payload) {
            dataPayload.push(payload[key]);
        }

        // * start transaction
        await query.transaction();

        // * check whether to make a file request 
        if(req.file) {
            let tmp_path = req.file.path;
            let originalExt =
                req.file.originalname.split(".")[
                req.file.originalname.split(".").length - 1
                ];
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
                let product = [...dataPayload, filename];

                await query.connectionQuery(
                     query.sqlQuery("SELECT * FROM products WHERE id = ? "),
                     Number(req.params.id),
                     async function(err, rows) {
                            // * absoulte path
                            let currentImage = `${config.rootPath}/public/upload/${rows[0].image_url}`;

                            // * cek absolute path
                            if(fs.existsSync(currentImage)) {
                                fs.unlinkSync(currentImage);
                            }   

                            // * handle failed query 
                            if(err) {
                                // * rollback
                                query.rollback();
                            } 
                });
            
                /**    
                * ! check connection query 
                * ! if true, return data
                * ! if false, return error
                */

                // ! make a function for the query, because it is used over and over 
                // * update data
                await query.connectionQuery(
                    query.sqlQuery(`
                            UPDATE products SET 
                            name = ?, 
                            description = ?, 
                            price = ?, 
                            image_url = ?
                            WHERE id = ${Number(req.params.id)}
                        `), 
                        product,
                        async function(err) {
                            // * handle failed query 
                            if(err) {
                                // * rollback
                                query.rollback();

                                //! error handling (temporary) 
                                return res.json({
                                    error: 1,
                                    message: err.sqlMessage,
                                });
                            }
                });
            
                // ! select data to find out the data entered by the user (temporarily)

                await query.connectionQuery(
                    query.sqlQuery("SELECT * FROM products ORDER BY id DESC LIMIT 1"),  
                    async function(err, rows) {
                        // * handle failed query 
                        if(err) {
                           // * rollback
                           query.rollback();
                        } 
                        return res.json(rows);
                    });
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

        // * commit
        await query.commit();
    }catch (err) {
        /**
        * ! The handler can't be used
        * ! Need a decorator!!... 
         */
        // * check error type 
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        // * error handling by express 
        next(err);
    }
}

async function destroy(req, res, next) {
     try {
        // * start transaction
        await query.transaction();

        // ! select data to find out the data entered by the user (temporarily) 
        await query.connectionQuery(
            //! Binding limit and skip
            query.sqlQuery(`SELECT * FROM products WHERE id = ?`),
            Number(req.params.id),  
            async function(err, rows) {
                // * handle failed query 
                if(err) {
                    // * rollback
                    query.rollback();
                } 
                
                if(rows.length > 0) {
                    // * absoulte path
                    let currentImage = `${config.rootPath}/public/upload/${rows[0].image_url}`;

                    // * cek absolute path
                    if(fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage);
                    }   

                    await connection.query(
                        query.sqlQuery(`DELETE FROM products WHERE id = ?`), 
                        rows[0].id, 
                        async function(){
                            if(err) {
                               // * rollback
                               query.rollback();
                            } 
                        });
                }

                return res.json(rows);
            });

        // * commit
        await query.commit();
    }catch(err) {
         // * error handling by express 
        next(err);
    }
}


module.exports = { store, index, update, destroy};