'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , path = require('path')
    
    /* NPM */
    
    /* in-package */
    ;

/**
 * Get home dir of current user.
 * @param {string} subpath path relative to the home dir
 */
function homepath(subpath) {
    let home = null;
    
    if (process.platform == 'win32') {
        home = process.env['USERPROFILE'];
    }
    else {
        home = process.env['HOME'];
    }
    
    return subpath ? path.join(home, subpath) : home;
}

module.exports = homepath;