'use strict'

const { validation } = require('./model/schema');
const { dbConnection } = require('./../../database');

async function store (req, res, next) {
    try {
        // * user request data 
        let payload = req.body;

        // ! START TRANSACTION
       
        // * check schema
        // * validation tag
        const validTag = await validation(payload);

        // * error validation
        if(validTag.hasOwnProperty('error')) {
            console.error(validTag);
            return res.json(validTag);
        }     

        // * konversion object to array
        const dataValidTag = Object.keys(validTag).map((_) => validTag[_]);

        // * insert tag
        await dbConnection.query( 
            `INSERT INTO tags (name) VALUES ?`,
            [[dataValidTag]], 
            async function(err, rows) {
                // * handle failed query 
                if(err) {
                    // * ROLLBACK
                        
                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql 
                    });
                }

            });

        // * COMMIT

        // ! select data to find out the data entered by the user (temporarily) 

        // * variable for id product and tag
        let ids = [];

        await dbConnection.query(
                "SELECT * FROM products ORDER BY id DESC LIMIT 1", 
                async function(err, rows) {
                     // * handle failed query 
                    if(err) {
                        // * ROLLBACK
                        
                        // * debug
                       console.error({
                            sqlMessage: err.sqlMessage,
                            sql: err.sql 
                        });
                    }

                    ids.push(rows[0].id);
                });
        
        // ! select data to find out the data entered by the user (temporarily) 
        await dbConnection.query(
                "SELECT * FROM tags ORDER BY id DESC LIMIT 1", 
                  async function(err, rows) {
                     // * handle failed query 
                    if(err) {
                        // * ROLLBACK
                        
                        // * debug
                       console.error({
                            sqlMessage: err.sqlMessage,
                            sql: err.sql 
                        });
                    }

                    ids.push(rows[0].id);

                    // ! INSERT TAG
                    await dbConnection.query( 
                        `INSERT INTO tags_detail(id_product, id_tag) VALUES ?`,
                        [[ids]], 
                        async function(err, rows) {
                            // * handle failed query 
                            if(err) {
                                // * ROLLBACK
                                    
                                // * debug
                                console.error({
                                    sqlMessage: err.sqlMessage,
                                    sql: err.sql 
                                });
                            }

                        });

                    return res.json(rows);
                });
    }catch (err) {
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

        // * check schema
        // * validation tag

        // ! UPDATE 1 DATA
        const validTag = await validation(payload);
       

        // * error validation
        if(validTag.hasOwnProperty('error')) {
            console.error(validTag);
            return res.json(validTag);
        }     
        
        // * konversion object to array
        const dataValidTag = Object.keys(validTag).map((_) => validTag[_]);
         
        // * catch id user
        dataValidTag.push(Number(req.params.id));
        
        // * insert category
        await dbConnection.query( 
            `UPDATE tags SET name = ? WHERE id = ?`,
            dataValidTag, 
            async function(err) {
                // * handle failed query 
                // * ROLLBACK
                
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
        
            // ! select data to find out the data entered by the user (temporarily) 
            await dbConnection.query(
                "SELECT * FROM tags WHERE id = ? ",
                Number(req.params.id), 
                async function(err, rows) {
                     // * handle failed query 
                    if(err) {
                        // * ROLLBACK
                        
                        // * debug
                        console.error({
                            sqlMessage: err.sqlMessage,
                            sql: err.sql 
                        });
                    } 

                    // * Data tidak ditemukan
                    if(rows?.length < 1) {
                        return res.json({
                            message: `tag with id ${Number(req.params.id)} not found`
                        });
                    } 

                    return res.json(rows);
            });
    }catch (err) {
        // * error handling by express 
        next(err);
    }
}

async function destroy(req, res, next) {
    try {
       // ! START TRANSACTION

       // ! select data to find out the data entered by the user (temporarily) 
       await dbConnection.query(
           `SELECT * FROM tags WHERE id = ?`,
           Number(req.params.id),  
           async function(err, rows) {
               // * handle failed query 
                if(err) {
                    // * ROLLBACK

                    // * debug
                    console.error({
                        sqlMessage: err.sqlMessage,
                        sql: err.sql 
                    });
                } 
                    
                // ! data tidak ditemukan
                if(rows?.length < 1) {
                    return res.json({
                        message: `tag with id ${Number(req.params.id)} not found`
                    });
                } 

                await dbConnection.query(
                       `DELETE FROM tags_detail WHERE id_tag = ?`, 
                       rows[0].id, 
                       async function(){
                           // * ROLLBACK
                            
                           if(err) {
                                // * ROLLBACK
                                    
                                // * debug
                                console.error({
                                    sqlMessage: err.sqlMessage,
                                    sql: err.sql 
                                });
                            }
                    });

                await dbConnection.query(
                       `DELETE FROM tags WHERE id = ?`, 
                       rows[0].id, 
                       async function(){
                           // * ROLLBACK
                            
                           if(err) {
                                // * ROLLBACK
                                    
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