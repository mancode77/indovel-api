'use strict'

const { validation } = require('./model/schema');
const { dbConnection } = require('./../../database');

async function store (req, res, next) {
    try {
        // * user request data 
        let payload = req.body;

        // ! START TRANSACTION

        // * check schema
        // * validation Category
        const validCategory = await validation(payload);

        // * error validation
        if(validCategory.hasOwnProperty('error')) {
            console.info(validCategory);
            return res.json(validCategory);
        }     

        // * konversion object to array
        const dataValidCategory = Object.keys(validCategory).map((_) => validCategory[_]);

        // * insert category
        await dbConnection.query( 
            `INSERT INTO categories (name)VALUES ?`,
            [[dataValidCategory]], 
            async function(err) {
            // * handle failed query 
            if(err) {
                    // * ROLLBACK
                    // ! EXPERIMENTAL
                        
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql 
                    });

                }
            });

            // * COMMIT
            // ! EXPERIMENTAL
        
            // ! select data to find out the data entered by the user (temporarily) 
            await dbConnection.query(
                "SELECT * FROM categories ORDER BY id DESC LIMIT 1", 
                  async function(err, rows) {
                     // * handle failed query 
                    if(err) {
                        // * ROLLBACK
                        // ! EXPERIMENTAL
                           
                        // * debug
                        console.error({
                            sqlMessage: err.sqlMessage,
                            sql: err.sql 
                        });
                    }

                    return res.json(rows);
             });
    }catch (err) {
        // * ERROR HANDLE VALIDATIONERROR

        // * error handling by express 
        next(err);
    }
}


// ! KESALAHAN PADA DEBUG
async function update (req, res, next) {
    try {
        // * user request data 
        let payload = req.body;

        // ! START TRANSACTION

        await dbConnection.query(
            "SELECT * FROM categories WHERE id = ? ",
            Number(req.params.id),
            async function(err, rows) {
                   // * handle failed query 
                   if(err) {
                        // ! EXPERIMENTAL
                        // * ROLLBACK
                        
                        // * debug
                        console.error({
                            sqlMessage: err.sqlMessage,
                            sql: err.sql 
                        });
                    } 
        });

        // * check schema
        // * validation Category
        const validCategory = await validation(payload);

        // * error validation
        if(validCategory.hasOwnProperty('error')) {
            console.info(validCategory);
            return res.json(validCategory);
        }     

        // * konversion object to array
        const dataValidCategory = Object.keys(validCategory).map((_) => validCategory[_]);

        // * catch id user
        dataValidCategory.push(Number(req.params.id));

        // * insert category
        await dbConnection.query( 
            `UPDATE categories SET name = ? WHERE id = ?`,
            dataValidCategory, 
            async function(err) {
                // * handle failed query
               if(err) {
                    // * ROLLBACK
                    // ! EXPERIMENTAL
                        
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql 
                    });

                }
            });

            // * COMMIT
            // ! EXPERIMENTAL
        
            // ! select data to find out the data entered by the user (temporarily) 
            await dbConnection.query(
                "SELECT * FROM categories WHERE id = ? ",
                Number(req.params.id), 
                async function(err, rows) {
                     // * handle failed query 
                    if(err) {
                        // * ROLLBACK
                        // ! EXPERIMENTAL
                        
                        // * debug
                        console.error({
                            sqlMessage: err.sqlMessage,
                            sql: err.sql 
                        });
                    } 

                    // * Data tidak ditemukan
                    if(rows?.length < 1) {
                        console.info('Data tidak ditemukan')
                        return res.json({
                            message: `tag with id ${Number(req.params.id)} not found`
                        });
                    } 

                    return res.json(rows);
             });
    }catch (err) {
        // * ERROR HANDLE VALIDATIONERROR

        // * error handling by express 
        next(err);
    }
}

// ! KESALAHAN PADA DEBUG
async function destroy(req, res, next) {
    try {
       // * start transaction
       // ! EXPERIMENTAL

       // ! select data to find out the data entered by the user (temporarily) 
       await dbConnection.query(
           //! Binding limit and skip
           `SELECT * FROM categories WHERE id = ?`,
           Number(req.params.id),  
           async function(err, rows) {
                // * handle failed query 
                if(err) {
                    // * ROLLBACK
                    // ! EXPERIMENTAL
                  
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql 
                    });
                } 

                 // * Data tidak ditemukan
                if(rows?.length < 1) {
                    console.info('Data tidak ditemukan');
                    return res.json({
                            message: `tag with id ${Number(req.params.id)} not found`
                    });
                } 
               
                await dbConnection.query(
                       `DELETE FROM categories WHERE id = ?`, 
                       rows[0].id, 
                       async function(){
                            if(err) {
                                // * ROLLBACK
                                // ! EXPERIMENTAL
                                    
                                // * debug
                                console.error({
                                    sqlMessage: err.sqlMessage,
                                    sql: err.sql 
                                });
                            }
                    });

               return res.json(rows);
           });
   }catch(err) {
        // * error handling by express 
       next(err);
   }
}

module.exports = { store, update , destroy };