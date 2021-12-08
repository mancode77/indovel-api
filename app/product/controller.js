'use strict'

const fs = require('fs');
const path = require('path');
const { Query } = require('./model');
const { connection } = require('./../../database');
const config = require('./../config');

async function store(req, res, next) {
    try{
        // * tangkap request dari user
        let payload = req.body;
        // * tampung data payload
        const dataPayload = [];
        
        // * ambil attribut dari payload
        for(let key in payload) {
            dataPayload.push(payload[key]);
        }

         // * instance object query sql
        let query = new Query();

          // * mulai transaction
        await connection.beginTransaction(function(err) {
            if(err) {
                console.error(`Gagal melakukan transaction: ${err}`);
                return;
            }
        });

        // * cek apakah melakukan request file
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

            // * baca file yang masih di lokasi sementara
            let src = fs.createReadStream(tmp_path);
            // *  pindahkan file ke lokasi permanen
            let dest = fs.createWriteStream(target_path);
            // *  mulai pindahkan file dari `src` ke `dest`
            src.pipe(dest);

            src.on("end", async () => {
                let product = [...dataPayload, filename];
                //! buat function untuk query, karena dipakai berulang
                await connection.query(
                    query.sqlInsert(), 
                    [[product]], 
                    async function(err, rows) {
                        // * tangani gagal query
                        if(err) {
                            // * rollback
                            await connection.rollback(function(err) {
                                console.error(`Gagal melakukan query: ${err}`);
                            });

                            // //! penanganan error ( sementara )
                            return res.json({
                                error: 1,
                                message: err.sqlMessage,
                            });
                        }
                });

                // ! select data untuk mengetahui data yang di inputkan user ( sementara )
                await connection.query(
                    query.sqlSelect("SELECT * FROM produk ORDER BY id DESC LIMIT 1"),  
                    async function(err, rows) {
                        // * tangani gagal query
                        if(err) {
                            // * rollback
                            await connection.rollback(function(err) {
                                console.error(`Gagal melakukan query: ${err}`);
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
                    // * tangani gagal query
                    if(err) {
                        // * rollback
                        await connection.rollback(function(err) {
                            console.error(`Gagal melakukan query: ${err}`);
                        });

                        // //! penanganan error ( sementara )
                        return res.json({
                            error: 1,
                            message: err.sqlMessage,
                        });
                    }
            });

            // ! select data untuk mengetahui data yang di inputkan user ( sementara )
            await connection.query(
                query.sqlSelect("SELECT * FROM produk ORDER BY id DESC LIMIT 1"),  
                async function(err, rows) {
                    // * tangani gagal query
                    if(err) {
                        // * rollback
                        await connection.rollback(function(err) {
                            console.error(`Gagal melakukan query: ${err}`);
                        });
                    } 
                    return res.json(rows);
            });
        }

        // * commit
        await connection.commit(function(err) {
            if(err) {
                console.error(`Gagal melakuka commit: ${err}`);
                return;
            }
        });
    }catch (err) {
        /**
        * ! Penangan belum bisa digunakan
        * ! Membutuhan decorator!!...
         */
        // * cek tipe error
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        // * penanganan error oleh express
        next(err);
    }
}

module.exports = { store };