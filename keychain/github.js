'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , readline = require('readline')
    
    /* NPM */
    , noda = require('noda')

    /* in-package */
    , conf = noda.inRequire('conf')
    , Rc = noda.inRequire('util/rc')
    ;

const rc = new Rc('github');

// Get or set token.
const token = rc.createRW('token');

module.exports = {
    token
};