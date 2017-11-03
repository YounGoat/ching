'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , path = require('path')
    
    /* NPM */
    
    /* in-package */
    ;

function MiniFS(options) {
    if (typeof options == 'string') {
        this.base = options;
    }
    else {
        this.base = options.base;
    }
}

MiniFS.prototype.fullpath = function(name) {
    return path.join(this.base, name);  
};

// To find whether base directory has specified sub item (directory or file).
MiniFS.prototype.exists = function(name) {
    return fs.existsSync(this.fullpath(name));
};

// To make specified sub directory in base directory.
MiniFS.prototype.mkdir = function(name) {
    return fs.mkdirSync(this.fullpath(name));
};
 
// To read specified sub file in base directory.
MiniFS.prototype.read = function(name, encoding) {
    return fs.readFileSync(this.fullpath(name), encoding);
};

// To read specified sub file in base directory.
MiniFS.prototype.readText = function(name, encoding = 'utf8') {
    return this.read(name, encoding);
};

// To write into specified sub file in base directory.
MiniFS.prototype.write = function(name, data) {
    fs.writeFileSync(this.fullpath(name), data);
};

module.exports = MiniFS;