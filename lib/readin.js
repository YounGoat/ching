'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , readline = require('readline')

    /* NPM */
    
    /* in-package */
    ;

function readin(question) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

module.exports = readin;