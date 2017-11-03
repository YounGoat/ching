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
    , bisheng = noda.inRequire('lib/bisheng')
    , clone = noda.inRequire('lib/clone')
    , dateformat = noda.inRequire('lib/dateformat')
    , readlineSync = noda.inRequire('lib/readlineSync')
    , varname = noda.inRequire('lib/varname')
    
    , conf = noda.inRequire('conf')
    , keychain = noda.inRequireDir('keychain')
    ;

const readResource = (name, encoding) => {
    let pathname = path.join(__dirname, 'resource', name);
    return fs.readFileSync(pathname, encoding);
}; 

module.exports = function(argv) {
    const projectHome = process.cwd();
    const projectName = path.basename(projectHome);

    const fsout = (() => {
        let fullpath = name => path.join(projectHome, name);
        
         // To find whether projectHome has specified sub item (directory or file).
        let exists = name => fs.existsSync(fullpath(name));
         
        // To make specified sub directory in projectHome.
        let mkdir = name => fs.mkdirSync(fullpath(name));

        // To read specified sub file in projectHome.
        let read = name => fs.readFileSync(fullpath(name), 'utf8');

        // To write into specified sub file in projectHome.
        let write = (name, data) => fs.writeFileSync(fullpath(name), data);

        return { exists, mkdir, read, write };
    })();
       

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
        
        // ---------------------------
        // STEP 3
        // Initialize NPM Package
        
        let packageJson = {};
        
        // Read package.json if existing.
        if (fsout.exists('package.json')) {
            packageJson = JSON.parse(fsout.read('package.json'));
        }
        
        // Make containers ready.
        [ 'bin', 'dependencies', 'devDependencies', 'directories', 'scripts' ].forEach((name) => {
            if (!packageJson[name]) {
                packageJson[name] = {};
            }
        });
        
        // Read package name.
        if (1) {
            // Get default package name.
            // Use directory name as next-best candidate.
            let name = if2(packageJson.name, projectName);
            packageJson.name = readlineSync('package name?', name);
        }

        // Read package version.
        if (1) {
            // Get default package version.
            let version = if2(packageJson.version, '0.0.0');
            packageJson.version = readlineSync('package version?', version);
        }
        
        // Read package main (entry piont).
        if (1) {
            let main = if2(packageJson.main, 'index.js');
            packageJson.main = readlineSync('entry point?', main);

            // Create main file.
            if (!fsout.exists(packageJson.main)) {
                fsout.write(packageJson.main, readResource('main.js'));
            }
        }

        // Read keywords.
        if (!packageJson.keywords) {
            let keywords = readlineSync('keyword? (seperate with comma)');
            packageJson.keywords = keywords.split(/\s*,\s*/);
        }

        // Read bin names.
        do {
            let name = readlineSync('binary name?');
            if (name) {
                if (!packageJson.bin[name]) {
                    let subpath = `bin/${name}.js`;
                    packageJson.bin[name] = subpath;
                    if (!fsout.exists('bin')) {
                        fsout.mkdir('bin');
                    }
                    if (!fsout.exists(subpath)) {
                        fsout.write(subpath, readResource('bin.js'));
                    }
                }
                console.log(`Binary ${name} saved.`);
            }
            else {
                break;
            }
        } while (1);

        // Set package homepage.
        packageJson.homepage = repo.html_url;
        
        // Set package description.
        packageJson.description = description;
        
        // Set package repository.
        packageJson.repository = {
            type: 'git',
            url: repo.clone_url
        };

        // Set package author.
        if (!packageJson.author) {
            let name = keychain.npm.author.Name();
            let email = keychain.npm.author.email();
            let url = keychain.npm.author.url();
            packageJson.author = { name, email, url };
        }

        // Set test command.
        if (!packageJson.scripts.test && !packageJson.directories.test && !fsout.exists('test')) {

            // Use mocha test framework.
            packageJson.scripts.test = 'mocha';

            // Add mocha into devDependencies.
            if (!packageJson.devDependencies['mocha']) {
                packageJson.devDependencies['mocha'] = conf.mocha;
            }

            // Create test directory.
            fsout.mkdir('test');

            // Create test demo.
            if (1) {
                fsout.write('test/index.js', readResource('test.js'));
            }

            console.log(`Unit test sample created.`);
        }

        // Generate CHANGELOG.md .
        if (!fsout.exists('CHANGELOG.md')) {
            let data = {
                name: packageJson.name,
                today: dateformat()
            };
            fsout.write('CHANGELOG.md', bisheng(readResource('CHANGELOG.md'), data));
            console.log(`CHANGELOG.md created.`);
        }

        // Generate README.md .
        if (!fsout.exists('README.md')) {
            let data = clone(packageJson, [ 'name', 'description', 'homepage' ]);
            let nameVar = varname(packageJson.name);
            Object.assign(data, { nameVar });
            fsout.write('README.md', bisheng(readResource('README.md'), data));
            console.log(`README.md created.`);
        }

        // Output packageJson.
        fsout.write('package.json', JSON.stringify(packageJson, null, 4));
        console.log(`package.json created or overwritten.`);

    }).catch((ex) => {
        console.log(ex);
    })
};
