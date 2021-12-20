'use strict'

const { categorySchema } = require('./model');
const { dbConnection } = require('./../../database');

async function store (req, res, next) {
    try {
        // * user request data 
        let payload = req.body;

        // ! START TRANSACTION

        // * check schema
        const product = await categorySchema.validateAsync(payload);
        // * konversion object to array
        const validProduct = Object.keys(product).map((_) => product[_]);

        // * insert category
        await dbConnection.query( 
            `INSERT INTO categories (name)VALUES ?`,
            [[validProduct]], 
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
                "SELECT * FROM categories ORDER BY id DESC LIMIT 1", 
                  async function(err, rows) {
                     // * handle failed query 
                    if(err) {
                        // * ROLLBACK
                        // ! EXPERIMENTAL
                        console.error(err)
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

        await queries.connectionQuery(
            "SELECT * FROM categories WHERE id = ? ",
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
        const product = await categorySchema.validateAsync(payload);
        // * konversion object to array
        const validProduct = Object.keys(product).map((_) => product[_]);

        // * catch id user
        validProduct.push(Number(req.params.id));

        // * insert category
        await dbConnection.query( 
            `UPDATE categories SET name = ? WHERE id = ?`,
            validProduct, 
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
                "SELECT * FROM categories ORDER BY id DESC LIMIT 1", 
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

module.exports = { store, update };