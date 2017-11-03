'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    , homepath = noda.inRequire('lib/homepath')
    ;

module.exports = {
    home: homepath('.ching'),
    mocha: '^3.3.0',
};