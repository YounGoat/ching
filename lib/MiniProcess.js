'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    
    /* in-package */
    ;

function MiniProcess(command, args) {
    child_process.spawnSync(command, args);
}
