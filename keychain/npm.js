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

const rc = new Rc('npm');

function author() {
    let name  = author.Name();
    let email = author.email();
    let url   = author.url();

    return { name, email, url };
}

author.Name = rc.createRW('author.name');
author.email = rc.createRW('author.email');
author.url = rc.createRW('author.url');

module.exports = {
    author
};