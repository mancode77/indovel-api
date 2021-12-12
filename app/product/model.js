'use strict'

const { connection } = require('./../../database');

// ! ideally use decorative...!!!

// ! This sql query is only used temporarily
function Query() {
	this.transaction = async function() {
		 // * start transaction
		 // ! UJI COBA
        return await connection.beginTransaction(function(err) {
                if(err) {
                    console.error(`Failed to make a transaction : ${err}`);
                    return;
                }
            });
	}

	this.connectionQuery = async function(...args) {
		if(args.length === 2) {
			let [query, asyncFunc] = args;
			return await connection.query(query, asyncFunc);
		}

		if(args.length === 3) {
			let [query, payload, asyncFunc] = args;
			return await connection.query(query, payload, asyncFunc);
		}
	}

    this.sqlQuery = function(query) {
        return query;
    };

    this.rollback = function() {
    	// * rollback
    	// ! UJI COBA
    	return await connection.rollback(function(err) {
                    	console.error(`Query failed : ${err}`);
                    });
    }

    this.commit = async function() {	
       // * commit
       // ! UJI COBA
       return await connection.commit(function(err) {
                if(err) {
                    console.error(`Failed to commit : ${err}`);
                    return;
                }
            });
    }
}

module.exports = { Query };