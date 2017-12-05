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

    , deleteRepository = require('github-rest/deleteRepository')
    
    /* in-package */
    , readlineSync = noda.inRequire('lib/readlineSync')
    
    , conf = noda.inRequire('conf')
    , keychain = noda.inRequireDir('keychain')
    ;


module.exports = function(argv) {
    const repoName = argv[0];

    co(function*() {
        const token = keychain.github.token();

        if (!repoName) {
            repoName = readlineSync('Remote repository name:');
        }

        let name = readlineSync(`Delete the remote repository? (Repeat its name "${repoName}" to confirm)`);
        if (name != repoName) {
            console.warn('Removing process aborted.');
            return;
        }

        yield deleteRepository({ token, name });
        console.log(`Remote repository deleted from GitHub.`);
        
    }).catch((ex) => {
        console.log(ex);
    })
};
