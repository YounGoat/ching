'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    
    /* in-package */
    ;


function camelCase(words) {
    words[0] = words[0].toLowerCase();
    for (var i = 1; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join('');
}

function PascalCase(words) {
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join('');
}

function unix_style(words) {
    words.map(word => word.toLowerCase());
    return words.join('_');
}

const FORMATS = {
    camelCase,
    PascalCase,
    unix_style,
    'camel' : camelCase,
    'pascal' : PascalCase,
    'unix': unix_style
}

function varname(name, style) {
    let formatter = FORMATS[ style ? style : 'camelCase'];
    if (!formatter) {
        throw new Error(`Invalid style: ${style}`);
    }

    let words = name.split(/[^0-9a-zA-Z]+/);

    let icode = words[0].charCodeAt(0);
    if (48 /* number 0 */ <= icode && icode <= 57 /* number 9 */) {
        words[0] = '_' + words[0];
    }

    return formatter(words);
}

module.exports = varname;