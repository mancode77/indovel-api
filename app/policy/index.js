//* Strict mode
'use strict'

/**
 * @description Module depedencies
 * @module database Mysql database connection to access sql query
 * @module schema Validate data from user
 */

const { AbilityBuilder, Ability } = require("@casl/ability");

const policies = {
    guest(user, { can }) {
        can('read', 'Product');
    },
    
    user(user, { can }) {
        can('create', 'Product');
        can('update', 'Product');
        can('delete', 'Product');

        can('create', 'Category');
        can('update', 'Category');
        can('delete', 'Category');

        can('view', 'Order');
        can('create', 'Order');
        can('read', 'Order');
     
        can('update', 'User');

        can('read', 'Cart');
        can('create', 'Cart');

        can('view', 'DeliveryAddress');
        can('create', 'DeliveryAddress');
        can('read', 'DeliveryAddress');
        can('update', 'DeliveryAddress');
        can('delete', 'DeliveryAddress');

        can('read', 'Invoice');
        can('create', 'Invoice');
    },

    admin(user, { can }) {
        can('manage', 'all');
    }
}

function policyFor(user) {
    let builder = new AbilityBuilder();

    if (user && typeof policies[user.role] === 'function') {
        policies[user.role](user, builder);
    } else {
        policies['guest'](user, builder);
    }

    return new Ability(builder.rules);
}

module.exports = { policyFor };