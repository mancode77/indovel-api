'use strict'

const fs = require('fs');
const path = require('path');
const { Queries } = require('./model/queries');
const { validation } = require('./model/schema');
const config = require('./../config');

// * instance object query sql
let queries = new Queries();

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
        // ! experimental
        // await queries.transaction('START TRANSACTION');
        
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

                // * validation peoduct
                const validProduct = await validation(product);
                 // * convert to array
                 console.info(validProduct);
                const dataValidProduct = Object.keys(validProduct).map((_) => validProduct[_]);

                // * insert data
                await queries.connectionQuery(
                    `
                        INSERT INTO products
                        (id_category, name, description, price, image_url)
                        VALUES ?
                    `,
                    [[dataValidProduct]], 
                    async function(err) {
                        // * handle failed query 
                        // * rollback
                        if(err) {
                            // ! experimental
                            await queries.rollback();
                            
                            return res.json({
                                error: 1,
                                message: err.sqlMessage,
                            });
                        }
                });
               
                // * commit
                // ! experimental
                // await queries.commit('COMMIT');

                // ! select data to find out the data entered, by category and tag, by the user (temporarily) 
                await queries.connectionQuery(
                   `
                        SELECT * FROM tags 
                        JOIN tags_detail 
                        ON (tags_detail.id_tag = tags.id) 
                        JOIN products 
                        ON (tags_detail.id_product = products.id) 
                        JOIN categories 
                        ON (categories.id = products.id);
                   `,
                    async function(err, rows) {
                        // * handle failed query 
                        if(err) {
                            // * rollback
                            // ! experimental
                            queries.rollback();
                            return res.json({
                                error: 1,
                                message: err.sqlMessage,
                            });
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
    }catch (err) {
        // * error handling by express 
        next(err);
    }
}

async function index(req, res, next) {
    try {

        let { limit = 10, skip = 0, q = '' , category = '', tags = []} = req.query;

        // * start transaction
        // ! experimental
        await queries.transaction('START TRANSACTION');

        // * check, whether to use keyword filters based on product, category, tags or one of them
        if(q.length || category.length || tags.length) {
            // ! select data to find out the data entered by the user (temporarily) 
            await queries.connectionQuery(
            `
                SELECT * FROM products
                JOIN categories ON 
                (products.id_category 
                = 
                categories.id)
                JOIN tags_detail ON
                (JOIN tags ON (tag_detail.id_tag = tags.id))
                WHERE MATCH
                (products.name, categories.name, tags.name) 
                AGAINTS(?,?,? IN NATURAL LANGUAGE MODE)
                ORDER BY product.id DESC LIMIT ?, ?
            `,
            [q, category, tags, Number(skip), Number(limit)],
            async function(err, rows) {
                // * handle failed query 
                if(err) {
                    // * rollback
                    queries.rollback();
                } 

                 // * commit
                // ! experimental
                await queries.commit('COMMIT');
                
                return res.json(rows);
            });
        }

        // ! select data to find out the data entered by the user (temporarily) 
        await queries.connectionQuery(
            `
                SELECT * FROM products
                JOIN categories ON 
                (products.id_category 
                = 
                categories.id)
                JOIN tags_detail ON
                (JOIN tags ON (tag_detail.id_tag = tags.id))
                ORDER BY product.id DESC LIMIT ?, ?
            `,
            [Number(skip), Number(limit)],
            async function(err, rows) {
                // * handle failed query 
                if(err) {
                    // * rollback
                    queries.rollback();
                } 

                 // * commit
                // ! experimental
                await queries.commit('COMMIT');
                
                return res.json(rows);
        });
    }catch(err) {
         // * error handling by express 
        next(err);
    }
}

async function update(req, res, next) {
    try{
        // * user request data 
        let payload = req.body;
        // * accommodate data payload
        const dataPayload = [];

        // * fetch attributes from payload 
        for(let key in payload) {
            dataPayload.push(payload[key]);
        }

        // * start transaction
        // ! experimental
        await queries.transaction('START TRANSACTION');

        // * catch category product
        // ! select data to find out the data entered by the user (temporarily) 
        await queries.connectionQuery(
            "SELECT * FROM categories WHERE id = ? ",
            dataPayload[1],
            async function(err, rows) {

                   // * handle failed query 
                   if(err) {
                       // * rollback
                       // ! experimental
                       queries.rollback();
                       
                       return res.json({
                           error: 1,
                           message: err.sqlMessage,
                       });
                   }
                   
                   if(rows.length < 1) {
                        return res.json({
                            error: 1,
                            message: 'Category tidak tersedia',
                        });
                   }
        });

        // * catch tag product
        // ! select data to find out the data entered by the user (temporarily) 
        await queries.connectionQuery(
            "SELECT * FROM tags WHERE id = ?",
            dataPayload[2],
            async function(err, rows) {

                   // * handle failed query 
                   if(err) {
                       // * rollback
                       // ! experimental
                       queries.rollback();
                       
                       return res.json({
                           error: 1,
                           message: err.sqlMessage,
                       });
                   }
                   
                   if(rows.length < 1) {
                        return res.json({
                            error: 1,
                            message: 'Tag tidak tersedia',
                        });
                   }
        });

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

                ////push id on last element of product array
                product.push(Number(req.params.id));

                await queries.connectionQuery(
                     "SELECT * FROM products WHERE id = ? ",
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
                                // ! experimental
                                queries.rollback();
                                
                                return res.json({
                                    error: 1,
                                    message: err.sqlMessage,
                                });
                            } 
                });
            
                // * validation peoduct
                const validProduct =  await validation(product);
                // * convert to array
                const dataValidProduct = Object.keys(validProduct).map((_) => validProduct[_]);

                dataValidProduct.push(Number(req.params.id));

                // * update data
                await queries.connectionQuery(
                        `
                            UPDATE products SET 
                            id_category = ?
                            name = ?, 
                            description = ?, 
                            price = ?, 
                            image_url = ?
                            WHERE id = ?
                        `, 
                        dataValidProduct, 
                        async function(err) {
                            // * handle failed query 
                            if(err) {
                                // * rollback
                                // ! experimental
                                queries.rollback();

                                //! error handling (temporary) 
                                return res.json({
                                    error: 1,
                                    message: err.sqlMessage,
                                });
                            }
                });

                // * commit
                // ! experimental
                await queries.commit('COMMIT');
            
                // ! select data to find out the data entered by the user (temporarily)
                await queries.connectionQuery(
                    ` 
                        SELECT * FROM products
                        JOIN categories ON 
                        (products.id_category 
                        = 
                        categories.id)
                        JOIN tags_detail ON
                        (JOIN tags ON (tag_detail.id_tag = tags.id))
                        WHERE products.id = ?
                    `,  
                    dataValidProduct.pop(),
                    async function(err, rows) {
                        // * handle failed query 
                        if(err) {
                           // * rollback
                           // ! experimental
                           queries.rollback();

                           return res.json({
                            error: 1,
                            message: err.sqlMessage,
                            });
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
        // ! experimental
        await queries.transaction('START TRANSACTION');

        // ! select data to find out the data entered by the user (temporarily) 
        await queries.connectionQuery(
            //! Binding limit and skip
            `SELECT * FROM products WHERE id = ?`,
            Number(req.params.id),  
            async function(err, rows) {
                // * handle failed query 
                if(err) {
                    // * rollback
                    // ! experimental
                    queries.rollback();

                    return res.json({
                        error: 1,
                        message: err.sqlMessage,
                    });
                } 
                
                if(rows.length > 0) {
                    // * absoulte path
                    let currentImage = `${config.rootPath}/public/upload/${rows[0].image_url}`;

                    // * check absolute path
                    if(fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage);
                    }   

                    await queries.connectionQuery(
                        `DELETE FROM products WHERE id = ?`, 
                        rows[0].id, 
                        async function(){
                            if(err) {
                               // * rollback
                               queries.rollback();

                               return res.json({
                                error: 1,
                                message: err.sqlMessage,
                            });
                            } 
                        });
                }

                // * commit
                // ! experimental
                await queries.commit('COMMIT');

                return res.json(rows);
            });
    }catch(err) {
         // * error handling by express 
        next(err);
    }
}

module.exports = { store, index, update, destroy };