'use strict'

const { tagSchema } = require('./model');
const { dbConnection } = require('./../../database');

async function store (req, res, next) {
    try {
        // * user request data 
        let payload = req.body;

        // ! START TRANSACTION

        // * check schema
        const tag = await tagSchema.validateAsync(payload);
        // * konversion object to array
        const validTag = Object.keys(tag).map((_) => tag[_]);

        // * insert category
        await dbConnection.query( 
            `INSERT INTO tags (name)VALUES ?`,
            [[validTag]], 
            async function(err) {
            // * handle failed query 
                if(err) {
                    // ! EXPERIMENTAL
                     // * ROLLBACK
                    console.error(err)
                    return res.json({
                        error: 1,
                        message: err.sqlMessage,
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
                        console.error(err);
                        
                        return res.json({
                            error: 1,
                            message: err.sqlMessage,
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
                        // ! EXPERIMENTAL
                        // * ROLLBACK
                        return res.json({
                            error: 1,
                            message: err.sqlMessage,
                        });
                   } 
        });

        // * check schema
        const tag = await tagSchema.validateAsync(payload);
        // * konversion object to array
        const validTag = Object.keys(tag).map((_) => tag[_]);

        // * catch id user
        validTag.push(Number(req.params.id));

        // * insert category
        await dbConnection.query( 
            `UPDATE categories SET name = ? WHERE id = ?`,
            validTag, 
            async function(err) {
            // * handle failed query 
                if(err) {
                    // ! EXPERIMENTAL
                    // * ROLLBACK
                    console.error(err);
                    
                    return res.json({
                        error: 1,
                        message: err.sqlMessage,
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
                        console.error(err);

                        return res.json({
                            error: 1,
                            message: err.sqlMessage,
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
                    console.error(err);

                   return res.json({
                       error: 1,
                       message: err.sqlMessage,
                   });
               } 
               
              
                await dbConnection.query(
                       `DELETE FROM tags WHERE id = ?`, 
                       rows[0].id, 
                       async function(){
                           if(err) {
                                // * ROLLBACK
                                // ! EXPERIMENTAL
                                console.error(err);

                                return res.json({
                                    error: 1,
                                    message: err.sqlMessage,
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