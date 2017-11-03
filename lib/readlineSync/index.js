'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , child_process = require('child_process')
    , path = require('path')
    
    /* NPM */
    
    /* in-package */
    ;


function readlineSync(question, defaultValue) {
    if (defaultValue) {
        process.stdout.write(`${question} [ ${defaultValue} ] `);
    }
    else {
        process.stdout.write(`${question} `);
    }

    let cmd = `node "${path.join(__dirname, 'readline')}"`;
	let options = {
		stdio: [ process.stdin ]
    };
    
    let line = null;
	try {
		let buf = child_process.execSync(cmd, options);
        line = buf.toString('utf8').replace(/[\r\n]+$/g, '');
	}
	catch (ex) {
		// DO NOTHING.
    }
    
    return (!line && defaultValue) ? defaultValue : line;
}

module.exports = readlineSync;
    