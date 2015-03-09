# kdz - kaidez's personal project scaffolding tool
## v.0.0.1
kdz is a Node and Promise-powered build tool I created for scaffolding out my projects.

Review the actual code in the [`kdz.js` file](https://github.com/kaidez/kdz/blob/master/kdz.js).


## How it works
To begin, start with typing either `kdz` or `kdz --help` in your terminal.  The following will be outputted:

    Usage: kdz [options] [command]


    Commands:

     app   scaffold a basic web application

    Options:

    -h, --help       output usage information
    -V, --version    output the version number
    -b, --build      create a SPA-like project
    -w, --wordpress  create a WordPress project
    -g, --gitignore  download ".gitignore" file
    -l, --less       download LESS files in "css-build"
    -s, --scss       download Sass files in "css-build"
    -t, --test       do a test scaffold


There is one command: `app`. Running `kdz app` scaffolds out a single-page-application (SPA) by performing the following steps:
* a `build` folder is created` with `css` and `js` subdirectories.
* a `coffee` folder is created`and includes a `main.coffee` file.
* a `css-build` folder is created with an `imports` subdirectory.
* and empty `image-min` folder is created (images that need to be minified go here)
* `bower.json`, `.bowerrc` and `STYLEGUIDE.md` files are downloaded.
* SPA-like `Gruntfile.js`, `gulpfile.js` and `package.json` files are downloaded.

Running `kdz app -w` scaffolds out a WordPress-like project.  It performs almost the same tasks as `kdz app` with the following difference:
* a `build` folder is not creates.
* The `Gruntfile.js`, `gulpfile.js` and `package.json` files that are downloaded are more geared toward WordPress development.

## OPTIONS
Aside from `-w`, there is small set of options

### `-g`
Download a `.gitignore` file to the root folder. If the `-w` option is passed, `.gitignore` will be WordPress-specific.

### `-l`
Download LESS files to `css-build` and `css-build/imports` If the `-w` option is passed, the LESS files will be WordPress-specific.

### `-s`
Download Sass files to `css-build` and `css-build/imports` If the `-w` option is passed, the Sass files will be WordPress-specific.

### `-t`
Create a test folder for where you can test your scaffold...this more for my testing will developing.
## TODO
* See how the promises can be made to work better.
* See if `download()` can be exported in. Will require a refactor.
* Perform error handling when flags are passed improperly.
* Remove `-b` flag since it's now the default build.
* See how templates can be used.

## COOL LINKS

Remember that `fs.existsSync()` is being deprecated...see [this](http://nodejs.org/api/fs.html#fs_fs_existssync_path)

[Command-line utilities with Node.js](http://cruft.io/posts/node-command-line-utilities/)

[Node.js as a build script](http://blog.millermedeiros.com/node-js-as-a-build-script/)

[Understanding `fs`](http://www.sitepoint.com/accessing-the-file-system-in-node-js/)

[TJ Holowaychuk commander article](http://tjholowaychuk.tumblr.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made)

[Shell script post from Axel Rauschmayer](http://www.2ality.com/2011/12/nodejs-shell-scripting.html)

[Great example on setting up promises](http://runnable.com/Uld0ZmCZki8aAABf/create-a-promise-with-q-for-node-js-and-promises)

[Good SO post on Promises with Q](http://stackoverflow.com/questions/22678613/how-to-actually-use-q-promise-in-node-js)

[Good post about using `delay` with promises](http://joseoncode.com/2013/05/23/promises-a-plus/)

[Good SO post on creating & saving files with `fs.createWriteStream()`.](http://stackoverflow.com/questions/2496710/writing-files-in-node-js)

[Another Good Node scripts post from Modulus](http://blog.modulus.io/nodejs-scripts)

[Great example of `Q.all()`](http://jsfiddle.net/En9n7/19/)

[Good Medium article on Node CLIs](https://medium.com/@_jh3y/creating-a-node-cli-application-72e539b2069a)

[Good SO article on `fs.write`](http://stackoverflow.com/questions/20309398/access-name-of-file-being-written-by-fs-writefile)

["Globals" instead of "this"](http://stackoverflow.com/questions/19850234/node-js-variable-declaration-and-scope)

[Excellent SO thread on `stdin`, `stdout` and `stderror`](http://stackoverflow.com/questions/3385201/confused-about-stdin-stdout-and-stderr)
