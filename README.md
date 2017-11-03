#	ching
__A command set help yto take care of your GitHub/NPM accounts__

It is really tedious to initialise an NPM package step by step. You have to: 
1.  Create a repository on GitHub.com;
2.  Create a local copy by cloning (or `git remote add ...`);
3.  Initialise as an NPM package via `npm init`;
4.  Input "git repository" info by hand;
5.  Input same "author" info again and again (unless you are used to change identities when developping different packages);
6.  Scarffold README.md, CHANGELOG.md to make your package seem formal;
7.  Scarffold unit test framework;
8.  ...

Now, __ching__ will help you to complete all previous tasks IN A FEW SECONDS!

##	Table of contents

*	[Get Started](#get-started)
*	[API](#api)
*   [Commands](#commands)
* 	[Examples](#examples)
*	[Why ching](#why-ching)
*	[Honorable Dependents](#honorable-dependents)
*	[About](#about)
*	[References](#references)

##	Links

*	[CHANGE LOG](./CHANGELOG.md)
*	[Homepage](https://github.com/YounGoat/ching)

##	Get Started

Up to now, __ching__ is a just a set of commands without any APIs exposed.

Before starting, please get the following ready:

*   You should have registered on [npmjs.com](https://www.npmjs.com).
*   You should have registered on [GitHub](https://github.com), and have created a personal access token with "repo" scope actived. 

On running, you may be asked for following informations about your GitHub/NPM accounts:

*   your GitHub personal access token \*
*   your e-mail address
*   your name
*   your homepage url

Rest asured that secret information (marked with asterisk) will only saved locally and be used deliberately. Others may be published along with README.md / package.json etc.

```bash
# Create an empty directory firstly.
mkdir example && cd example

# Run "ching init" command interactively.
ching init
```

##	API

APIs are not available yet.

##  Commands

*   [init](#ching-init)
*   [github-init](#ching-github-init)
*   [rename](#ching-rename)
*   [reset](#ching-reset)

### ching init

This command interactively leads you to,

*   create remote repository on GitHub.com
*   make current directory initialized to be a Git repository and bound to the remote one
*   create/edit package.json
*   create scaffording for the package

### ching github-init

Similiar to __ching init__, this command will help you to create remote repository on GitHub.com and bound it to local Git repository.

### ching rename

This command interactively leads you to,

*   delete remote repository on GitHub.com, create a new one and simultaneously re-bound local repository to it
*   change the name of current NPM package

### ching reset

This command removes all local-saved information about your GitHub/NPM accounts.

##  Examples

##  Why *ching*

*ching* is my name, my favor and my fate.

##  Honorable Dependents

##  About

##  References

*   [Creating a personal access token for the command line](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)