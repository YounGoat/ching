#!/usr/bin/env node

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , child_process = require('child_process')
    
    /* NPM */
    , co = require('co')
    , noda = require('noda')

    , whoami = require('github-rest/whoami')
    , deleteRepository = require('github-rest/deleteRepository')
    , createRepository = require('github-rest/createRepository')
    
    /* in-package */
    , MiniFS = noda.inRequire('lib/MiniFS')
    , MiniProc = noda.inRequire('lib/MiniProcess')
    , readlineSync = noda.inRequire('lib/readlineSync')

    , keychain = noda.inRequireDir('keychain')
    ;

module.exports = function(argv) {
    const projectHome = process.cwd();
    const fsout = new MiniFS(projectHome);

    co(function*() {

        const token = keychain.github.token();
        let packageJson = null;
        
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
        // Check If NPM package

        if (!fsout.exists('package.json')) {
            console.error('CWD is not an NPM project.');
            return;          
        }
        packageJson = JSON.parse(fsout.readText('package.json'));
        console.log('NPM project found.');

        // ---------------------------
        // STEP 2
        // Change NPM Package Name

        if (1) {
            packageJson.name = readlineSync('package name?', packageJson.name);
        }

        // ---------------------------
        // STEP 3
        // Change Remote Repository Name

        
        // Check whether the directory is a git repository.
        if (1) {
            let ret = child_process.spawnSync('git', [ 'status' ]);
            if (ret.status != 0) {
                console.error('CWD is not a git repository.');
                return;
            }
            console.log('Local git repository found.');
        }

        // Check whether remote repository added.
        let repoName = null;
        if (1) {
            let ret = child_process.spawnSync('git', [ 'remote', 'get-url', 'origin' ]);
            if (ret.status != 0) {
                console.log('Local repository has not add remote repositories.');
            }
            else {
                let lines = ret.stdout.toString('utf8').split(/\n/g);
                let urlname = lines[0];
                if (/^https:\/\/github.com\/([^\/]+)\/(.+)\.git$/.test(urlname) === false) {
                    console.error('Remote repository is not a GitHub one.');
                    return;
                }
                let ownerUsername = RegExp.$1;
                repoName = RegExp.$2;
                
                const githubUser = yield whoami({ token });
                if (ownerUsername != githubUser.login) {
                    console.error(`Remote repository and current GitHub token do not belong to the same owner.`);
                    return;
                }
            }
        }
        
        // Delete old remote repository and create a new one.
        if (1) {
            let newName = readlineSync('repository name?', repoName);

            // Delete the current remote repository.
            if (repoName && newName != repoName) {
                let name = readlineSync(`Delete the remote repository? (Repeat its name "${repoName}" to confirm)`);
                if (name != repoName) {
                    console.warn('Renaming process aborted.');
                    return;
                }
                yield deleteRepository({ token, name });
                console.log(`Remote repository deleted from GitHub.`);
            }

            // Create a new one.
            if (newName != repoName) {
                let repo = yield createRepository({ 
                    token, 
                    name: newName,
                    description: packageJson.description
                });
                console.log(`Remote repository created on GitHub.`);

                // Change the remote address for local repository.
                child_process.spawn('git', [ 'remote', 'set-url', 'origin', repo.clone_url ]);

                // Set package homepage.
                packageJson.homepage = repo.html_url;
                
                // Set package repository.
                packageJson.repository = {
                    type: 'git',
                    url: repo.clone_url
                };
            }
            
        }

        // Output packageJson.
        fsout.write('package.json', JSON.stringify(packageJson, null, 4));
        console.log(`package.json created or overwritten.`);

    }).catch((ex) => {
        console.log(ex);
    })
};