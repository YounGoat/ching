#!/usr/bin/env node

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , path = require('path')

    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    , conf = noda.inRequire('conf')
    , rmfr = noda.inRequire('lib/rmfr')
    ;

module.exports = function(argv) {
    if (argv[0]) {
        try {
            let pathname = path.join(conf.home, argv[0] + '.json');
            fs.unlinkSync(pathname);
        } catch (error) {
            // DO NOTHING.
        }
    }
    else {
        rmfr(conf.home);
    }
};
