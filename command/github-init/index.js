#!/usr/bin/env node

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , child_process = require('child_process')
    , fs = require('fs')
    , path = require('path')
    
    /* NPM */
    , co = require('co')
    , if2 = require('if2')
    , noda = require('noda')

    , getRepository = require('github-rest/getRepository')
    , createRepository = require('github-rest/createRepository')
    
    /* in-package */
    , readlineSync = noda.inRequire('lib/readlineSync')
    
    , conf = noda.inRequire('conf')
    , keychain = noda.inRequireDir('keychain')
    ;


module.exports = function(argv) {
    const projectHome = process.cwd();
    const projectName = path.basename(projectHome);

    co(function*() {
        
        // ---------------------------
        // STEP 0
        // Check Tools
        
        // Check the availablity of command git.
        if (1) {
            let ret = child_process.spawnSync('git', [ '--version' ]);
            if (ret.error) {
                console.error('command not ready: git');
                return;
            }
        }

        // ---------------------------
        // STEP 1
        // Create Remote Repository On GitHub

        // Get personal access token.
        const token = keychain.github.token();
        
        // Read repository name and check existence.
        let repoName;
        if (1) {
            let repo;
            do {
                repoName = readlineSync('repository name?', projectName);
                console.info(`Checking if repository name ${repoName} is occupied ...`);
                repo = yield getRepository({ token, name: repoName });
                if (repo) {
                    console.warn(`Repository ${repoName} has already existed.`);
                }
            } while(repo)
            console.log(`Repository name ${repoName} is available.`);
        }

        // Read description.
        // This information will be used to describe both the repository and npm package.
        const description = readlineSync('description?');

        // Create repository.
        const repo = yield createRepository({
            token,
            name: repoName,
            description,
        });
        console.log(`Remote repository created on GitHub.`);

        // ---------------------------
        // STEP 2
        // Initialize Local Git Repository

        // Check whether cwd is a git repository.
        if (1) {
            let ret = child_process.spawnSync('git', [ 'status' ]);
            if (ret.status == 0) {
                console.error('CWD has already been a git repository.')
                return;
            }
        }

        // Init cwd as a git repository.
        child_process.spawnSync('git', [ 'init' ]);
        console.log(`Local repository created.`);

        // Add remote repository address to local repository.
        child_process.spawnSync('git', [ 'remote', 'add', 'origin', repo.clone_url ]);
        
    }).catch((ex) => {
        console.log(ex);
    })
};
