'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , path = require('path')

    /* NPM */
    
    /* in-package */
    ;

function rmfr(pathname) {
	if (fs.existsSync(pathname)) {
		if (fs.statSync(pathname).isDirectory()) {
			// 删除目录内容。
			fs.readdirSync(pathname).forEach(function(filename) {
				rmfr(path.join(pathname, filename));
			})

			// 删除目录。
			fs.rmdirSync(pathname);
		}
		else {
			// 删除文件。
			fs.unlinkSync(pathname);
		}
	}
}

module.exports = rmfr;