'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    
    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    ;

module.exports = function() {
    let names = fs.readdirSync(noda.inResolve('command'));
    console.log();
    console.log('NAME');
    console.log('    ching - Powerful manage tool for NPM package.');
    console.log();
    console.log('SYNOPSIS');
    console.log('    ching <sub-command-name> [argv]');
    console.log('    Invoke specified sub command which is developed on the Ching platform.');
    console.log();
    names.forEach((name) => {
        name = name.replace(/\.js$/, '');
        console.log(`    ching ${name}`);

        let commandJson = noda.inRequire(`command/${name}/command.json`, true);
        if (commandJson) {
            console.log(`    ${commandJson.description}`);
        }

        console.log();
    });
    console.log();
};