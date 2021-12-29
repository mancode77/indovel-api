'use strict'

const { categorySchema } = require('./model');
const { dbConnection } = require('./../../database');

async function store (req, res, next) {
    try {
        // * user request data 
        let payload = req.body;

        // ! START TRANSACTION

        // * check schema
        try {
            const category = await categorySchema.validateAsync(payload);
        } catch (err) {
            return res.json({
                        error: 1,
                        product: err._original, 
                        details_error: {
                            message: err.details[0].message
                        }
            });
        }
      
        // * konversion object to array
        const validCategory = Object.keys(category).map((_) => category[_]);

        // * insert category
        await dbConnection.query( 
            `INSERT INTO categories (name)VALUES ?`,
            [[validCategory]], 
            async function(err) {
            // * handle failed query 
            // * ROLLBACK
            // ! EXPERIMENTAL               
                           
            // * debug
                console.error({
                    sqlMessage: err.sqlMessage,
                    sql: err.sql 
                });
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
        const category = await categorySchema.validateAsync(payload);

        // * check schema
        try {
            const category = await categorySchema.validateAsync(payload);
        } catch (err) {
            return res.json({
                        error: 1,
                        product: err._original, 
                        details_error: {
                            message: err.details[0].message
                        }
            });
        }

        // * konversion object to array
        const validCategory = Object.keys(category).map((_) => category[_]);

        // * catch id user
        validCategory.push(Number(req.params.id));

        // * insert category
        await dbConnection.query( 
            `UPDATE categories SET name = ? WHERE id = ?`,
            validCategory, 
            async function(err) {
                // * handle failed query
                // ! EXPERIMENTAL
                // * ROLLBACK
                // * debug
                console.error({
                    sqlMessage: err.sqlMessage,
                    sql: err.sql 
                });
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

async function destroy(req, res, next) {
    try {
       // * start transaction
       // ! EXPERIMENTAL

       // ! select data to find out the data entered by the user (temporarily) 
       await dbConnection.query(
           //! Binding limit and skip
           `SELECT * FROM products WHERE id = ?`,
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
               
              
                await dbConnection.query(
                       `DELETE FROM products WHERE id = ?`, 
                       rows[0].id, 
                       async function(){
                            // * ROLLBACK
                            // ! EXPERIMENTAL
                            
                            // * debug
                            console.error({
                                sqlMessage: err.sqlMessage,
                                sql: err.sql 
                            });
                    });

               return res.json(rows);
           });
   }catch(err) {
        // * error handling by express 
       next(err);
   }
}

module.exports = { store, update , destroy };