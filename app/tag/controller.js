'use strict'

const { validation } = require('./model/schema');
const { dbConnection } = require('./../../database');

async function store (req, res, next) {
    try {
        // * user request data 
        let payload = req.body;
        // ! START TRANSACTION
       
        // * check schema
        // ! REPAIR
       
        // * validation tag
        const validTag = await validation(payload);

        // * error validation
        if(validTag.hasOwnProperty('error')) {
            console.error(validTag);
            return res.json(validTag);
        }     

        // * konversion object to array
        const dataValidTag = Object.keys(validTag).map((_) => validTag[_]);

        // * insert category
        await dbConnection.query( 
            `INSERT INTO tags (name) VALUES ?`,
            [[dataValidTag]], 
            async function(err, rows) {
                // * handle failed query 
                // * ROLLBACK
                // ! EXPERIMENTAL
                
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
                "SELECT * FROM tags ORDER BY id DESC LIMIT 1", 
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
            "SELECT * FROM tags WHERE id = ? ",
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
        });

         // * validation tag
        const validTag = await validation(payload);

        // * error validation
        if(validTag.hasOwnProperty('error')) {
            console.info('data')
            return res.json(validTag);
        }     

        // * konversion object to array
        const dataValidTag = Object.keys(validTag).map((_) => validTag[_]);

        // * catch id user
        validTag.push(Number(req.params.id));

        // * insert category
        await dbConnection.query( 
            `UPDATE categories SET name = ? WHERE id = ?`,
            validTag, 
            async function(err) {
                // * handle failed query 
                // * ROLLBACK
                // ! EXPERIMENTAL
                
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
                "SELECT * FROM tags ORDER BY id DESC LIMIT 1", 
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
           `SELECT * FROM tags WHERE id = ?`,
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
                       `DELETE FROM tags WHERE id = ?`, 
                       rows[0].id, 
                       async function(){
                           // * ROLLBACK
                           // ! EXPERIMENTAL
                            
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