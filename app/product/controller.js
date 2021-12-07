'use strict'

const { Query } = require('./model');
const { connection } = require('./../../database');

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
        await connection.beginTransaction();
        
          // * insert data 
        await connection.query(
            query.sqlInsert(), 
            [[dataPayload]], 
            function(err, rows) {
                // * tangani gagal query
                if(err) {
                    // * rollback
                    return connection.rollback(function(err) {
                        console.error(`Gagal melakukan query: ${err}`);
                        return;
                    });
                }
        });

        // * commit
        await connection.commit();

        // * return data json 
        return res.json();
    }catch (err) {
        // * penanganan error oleh express
        next(err);
    }
}

module.exports = { store };