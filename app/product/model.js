'use strict'

// ! ideally use decorative...!!!

// ! This sql query is only used temporarily
function Query() {
    this.sqlInsert = function() {
        return `
            INSERT INTO products
            (name, description, price, image_url)
            VALUES ?
        `;
    };

    this.sqlSelect = function(query) {
        return query;
    }

    this.sqlUpdate = function(query) {
        return query;
    }

    this.sqlDelete = function(query) {
        return query;
    }
}

module.exports = { Query };