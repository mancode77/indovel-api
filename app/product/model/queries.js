'use strict'

const { dbConnection } = require('./../../../database');

// ! ideally use decorative...!!!

// ! This sql query is only used temporarily
function Queries() {
	this.sqlSelect =  
				`SELECT
                categories.id AS category_id,
                categories.name AS category_name,
                categories.created_at AS category_created_at,
                categories.updated_at AS category_updated_at,
				products.id AS product_id,
                products.name AS product_name,
                products.description AS product_description,
                products.price AS product_price,
                products.image_url AS product_image_url,
                products.created_at AS product_created_at,
                products.updated_at AS product_updated_at,
                tags.id AS tag_id,
                tags.name AS tag_name,
                tags.created_at AS tag_created_at,
                tags.updated_at AS tag_updated_at
                FROM tags 
                JOIN tags_detail 
                ON (tags_detail.id_tag = tags.id) 
                JOIN products 
                ON (tags_detail.id_product = products.id) 
                JOIN categories 
                ON (categories.id = products.id_category)
                ORDER BY products.id DESC LIMIT ?, ?`;

	this.productFilter =  
				`SELECT
                categories.id AS category_id,
                categories.name AS category_name,
                categories.created_at AS category_created_at,
                categories.updated_at AS category_updated_at,
				products.id AS product_id,
                products.name AS product_name,
                products.description AS product_description,
                products.price AS product_price,
                products.image_url AS product_image_url,
                products.created_at AS product_created_at,
                products.updated_at AS product_updated_at,
                tags.id AS tag_id,
                tags.name AS tag_name,
                tags.created_at AS tag_created_at,
                tags.updated_at AS tag_updated_at
                FROM tags 
                JOIN tags_detail 
                ON (tags_detail.id_tag = tags.id) 
                JOIN products 
                ON (tags_detail.id_product = products.id) 
                JOIN categories 
                ON (categories.id = products.id_category)
                WHERE MATCH(products.name)
                AGAINST (? IN NATURAL LANGUAGE MODE)
                ORDER BY products.id DESC LIMIT ?, ?`;

	// ! comming soon

	// this.categoryFilter =  
	// 			`SELECT
    //             categories.id AS category_id,
    //             categories.name AS category_name,
    //             categories.created_at AS category_created_at,
    //             categories.updated_at AS category_updated_at,
    //             products.name AS product_name,
    //             products.description AS product_description,
    //             products.id AS product_id,
    //             products.price AS product_price,
    //             products.image_url AS product_image_url,
    //             products.created_at AS product_created_at,
    //             products.updated_at AS product_updated_at,
    //             tags.id AS tag_id,
    //             tags.name AS tag_name,
    //             tags.created_at AS tag_created_at,
    //             tags.updated_at AS tag_updated_at
    //             FROM tags 
    //             JOIN tags_detail 
    //             ON (tags_detail.id_tag = tags.id) 
    //             JOIN products 
    //             ON (tags_detail.id_product = products.id) 
    //             JOIN categories 
    //             ON (categories.id = products.id_category)
    //             WHERE MATCH(categories.name)
    //             AGAINST (? IN NATURAL LANGUAGE MODE)
    //             ORDER BY products.id DESC LIMIT ?, ?`;

	// this.tagFilter =  
	// 			`SELECT
    //             categories.id AS category_id,
    //             categories.name AS category_name,
    //             categories.created_at AS category_created_at,
    //             categories.updated_at AS category_updated_at,
    //             products.name AS product_name,
    //             products.description AS product_description,
    //             products.id AS product_id,
    //             products.price AS product_price,
    //             products.image_url AS product_image_url,
    //             products.created_at AS product_created_at,
    //             products.updated_at AS product_updated_at,
    //             tags.id AS tag_id,
    //             tags.name AS tag_name,
    //             tags.created_at AS tag_created_at,
    //             tags.updated_at AS tag_updated_at
    //             FROM tags 
    //             JOIN tags_detail 
    //             ON (tags_detail.id_tag = tags.id) 
    //             JOIN products 
    //             ON (tags_detail.id_product = products.id) 
    //             JOIN categories 
    //             ON (categories.id = id_category)
    //             WHERE MATCH(tags.name)
    //             AGAINST (? IN NATURAL LANGUAGE MODE)
    //             ORDER BY products.id DESC LIMIT ?, ?`;

	// ! experimental
	this.transaction = async function(query) {
		 // * start transaction
        return await dbConnection.query(query);
	}

	this.connectionQuery = async function(...args) {
		let [query, payload, asyncFunc] = args;
		return await dbConnection.query(query, payload, asyncFunc);
	}

	// ! experimental
    this.rollback = async function() {
    	// * rollback
    	return await dbConnection.rollback(function(err) {
                    	console.error(`Query failed : ${err}`);
                    });
    }

	// ! experimental
    this.commit = async function(query) {	
       // * commit
       return await dbConnection.query(query);
    }
}

module.exports = { Queries };