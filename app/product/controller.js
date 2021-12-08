'use strict'

const fs = require('fs');
const path = require('path');
const { Query } = require('./model');
const { connection } = require('./../../database');
const config = require('./../config');

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

         // * instance object query sql
        let query = new Query();

          // * start transaction
        await connection.beginTransaction(function(err) {
            if(err) {
                console.error(`Failed to make a transaction : ${err}`);
                return;
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
                //! make a function for the query, because it is used over and over 
                await connection.query(
                    query.sqlInsert(), 
                    [[product]], 
                    async function(err, rows) {
                        // * handle failed query 
                        if(err) {
                            // * rollback
                            await connection.rollback(function(err) {
                                console.error(`Query failed : ${err}`);
                            });

                            //! error handling (temporary) 
                            return res.json({
                                error: 1,
                                message: err.sqlMessage,
                            });
                        }
                });

                // ! select data to find out the data entered by the user (temporarily) 
                await connection.query(
                    query.sqlSelect("SELECT * FROM products ORDER BY id DESC LIMIT 1"),  
                    async function(err, rows) {
                        // * handle failed query 
                        if(err) {
                            // * rollback
                            await connection.rollback(function(err) {
                                console.error(`Query failed: ${err}`);
                            });
                        } 
                        return res.json(rows);
                });
            });

            src.on("error", async (err) => {
                next(err);
            });
        } else {
            // * insert data 
            await connection.query(
                query.sqlInsert(), 
                [[dataPayload]], 
                async function(err, rows) {
                    // * handle failed query 
                    if(err) {
                        // * rollback
                        await connection.rollback(function(err) {
                            console.error(`Query failed: ${err}`);
                        });

                        //! error handling (temporary) 
                        return res.json({
                            error: 1,
                            message: err.sqlMessage,
                        });
                    }
            });

            // ! select data to find out the data entered by the user (temporarily) 
            await connection.query(
                query.sqlSelect("SELECT * FROM products ORDER BY id DESC LIMIT 1"),  
                async function(err, rows) {
                    // * tangani gagal query
                    if(err) {
                        // * rollback
                        await connection.rollback(function(err) {
                            console.error(`Query failed: ${err}`);
                        });
                    } 
                    return res.json(rows);
            });
        }

        // * commit
        await connection.commit(function(err) {
            if(err) {
                console.error(`Failed to commit : ${err}`);
                return;
            }
        });
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

module.exports = { store };