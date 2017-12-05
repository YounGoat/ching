'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , path = require('path')
   
    /* NPM */
    , noda = require('noda')

    /* in-package */
    , conf = noda.inRequire('conf')
    , readlineSync = noda.inRequire('lib/readlineSync')    
    ;

(function init() {
    let home = conf.home;
    if (!fs.existsSync(home)) {
        fs.mkdirSync(home);
        console.log(`home directory created: ${home}`);
    }
    else if (!fs.statSync(home).isDirectory()) {
        console.error(`expected home is not a directory: ${home}`);
    }
    else {
        // console.log(`home directory found: ${home}`);
    }
})();

const getJsonPath = name => path.join(conf.home, name + '.json');

const getJson = name => {
    let json = {};
    let jsonpath = getJsonPath(name);
    if (fs.existsSync(jsonpath)) {
        json = JSON.parse(fs.readFileSync(jsonpath, 'utf8'));
    }
    return json;
};

function RC(name) {
    this.name = name;
}

// Get resource property.
RC.prototype.get = function(subname) {
    return getJson(this.name)[subname];
};

// Set resource property.
RC.prototype.set = function(subname, value) {
    let jsonpath = getJsonPath(this.name);
    let json = getJson(this.name);
    json[subname] = value;
    fs.writeFileSync(jsonpath, JSON.stringify(json, null, 4));    
};

// Create Reader/Writer method for resource property.
RC.prototype.createRW = function(subname) {
    return function(value) {
        if (arguments.length == 0) {
            let value = this.get(subname);
    
            // If expected property not exists, read and write/save it.
            if (typeof value == 'undefined') {
                value = readlineSync(`#${this.name.toUpperCase()}# ${subname}?`);
                this.set(subname, value);
            }
    
            return value;
        }
        else {
            return this.set(subname, value);
        }
    }.bind(this);
};

module.exports = RC;

