'use strict'

function Query() {
    this.sqlInsert = function() {
        return `
            INSERT INTO produk
            (nama, deskripsi, harga)
            VALUES ?
        `;
    }
}

module.exports = { Query };