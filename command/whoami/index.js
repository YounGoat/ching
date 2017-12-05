#!/usr/bin/env node

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , child_process = require('child_process')
    , fs = require('fs')
    , path = require('path')
    
    /* NPM */
    , co = require('co')
    , if2 = require('if2')
    , noda = require('noda')
    , whoami = require('github-rest/whoami')
    
    /* in-package */
    , conf = noda.inRequire('conf')
    , keychain = noda.inRequireDir('keychain')
    ;


module.exports = function(argv) {
    const repoName = argv[0];

    co(function*() {
        const author = keychain.npm.author();
        console.log('-- NPM --');
        console.log(`${author.name} <${author.email}>`);

        console.log();

        console.log('-- GitHub --');
        const token = keychain.github.token();
        const info = yield whoami({ token });
        console.log(`${info.login} "${info.name}"`);
        
    }).catch((ex) => {
        console.log(ex);
    })
};
