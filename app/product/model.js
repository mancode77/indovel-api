'use strict'

function Query() {
    this.sqlInsert = function() {
        return `
            INSERT INTO produk
            (nama, deskripsi, harga, url_gambar)
            VALUES ?
        `;
    };

    this.sqlSelect = function(query) {
        return query;
    }
}

module.exports = { Query };