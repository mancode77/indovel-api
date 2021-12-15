'use strict'

const { dbConnection } = require('./../../database');

// ! ideally use decorative...!!!

// ! This sql query is only used temporarily
function Queries() {
	this.transaction = async function() {
		 // * start transaction
        return await dbConnection.beginTransaction(function(err) {
                if(err) {
                    console.error(`Failed to make a transaction : ${err}`);
                    return;
                }
            });
	}

	this.connectionQuery = async function(...args) {
		if(args.length === 2) {
			let [query, asyncFunc] = args;
			return await dbConnection.query(query, asyncFunc);
		}

		if(args.length === 3) {
			let [query, payload, asyncFunc] = args;
			return await dbConnection.query(query, payload, asyncFunc);
		}
	}

    this.rollback = async function() {
    	// * rollback
    	return await dbConnection.rollback(function(err) {
                    	console.error(`Query failed : ${err}`);
                    });
    }

    this.commit = async function() {	
       // * commit
       return await dbConnection.commit(function(err) {
                if(err) {
                    console.error(`Failed to commit : ${err}`);
                    return;
                }
            });
    }
}

module.exports = { Queries };