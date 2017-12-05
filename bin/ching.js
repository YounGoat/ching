#!/usr/bin/env node

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    
    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    ;

let argv = process.argv.slice(2);
let command = null;
if (argv.length && !argv[0].startsWith('-')) {
    command = argv.shift();
}
if (!command) {
    command = 'help';
}

if (!noda.inExists(`command/${command}`)) {
    console.error(`No such sub-command: ${command}`);
    process.exit(1);
}
noda.inRequire(`command/${command}`)(argv);