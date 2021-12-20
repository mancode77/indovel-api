'use strict'

const { dbConnection } = require('./../../../database');

// ! ideally use decorative...!!!

// ! This sql query is only used temporarily
function Queries() {
	this.transaction = async function(query) {
		 // * start transaction
        return await dbConnection.query(query);
	}

	this.connectionQuery = async function(...args) {
		let [query, payload, asyncFunc] = args;
		return await dbConnection.query(query, payload, asyncFunc);
	}

    this.rollback = async function() {
    	// * rollback
    	return await dbConnection.rollback(function(err) {
                    	console.error(`Query failed : ${err}`);
                    });
    }

    this.commit = async function(query) {	
       // * commit
       return await dbConnection.query(query);
    }
}

module.exports = { Queries };