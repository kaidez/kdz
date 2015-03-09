# ![Alt text](kdz-logo.png)
## kaidez's personal project scaffolding tool
v.0.0.1


kdz is a Node and Promise-powered build tool I created for scaffolding out my projects.

Review the actual code in [`kdz.js`](https://github.com/kaidez/kdz/blob/master/kdz.js).


### How it works
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

### Options
There is small set of options

#### `-w`
Scaffolds out a WordPress-like project.  It performs almost the same tasks as `kdz app` with the following difference:

* a `build` folder is not created.
* The `Gruntfile.js`, `gulpfile.js` and `package.json` files that are downloaded are more geared toward WordPress development.

#### `-g`
Download a `.gitignore` file to the root folder. If the `-w` option is passed, `.gitignore` will be WordPress-specific.

#### `-l`
Download LESS files to `css-build` and `css-build/imports` If the `-w` option is passed, the LESS files will be WordPress-specific.

#### `-s`
Download Sass files to `css-build` and `css-build/imports` If the `-w` option is passed, the Sass files will be WordPress-specific.

#### `-t`
Create a test folder for where you can test your scaffold...this is more for my testing while developing.
## TODO
kdz is still new so there are some things I'd still like to do:
* See how the promises can be made to work better.
* Create specific commands for both the LESS and Sass downloads...don't make them work with just an option.
* Update the whole "test" folder process...use one folder instead of two & add it to `gitignore`.
* See if the `download()` function can be exported in. Will require a refactor.
* Perform error handling when flags are passed improperly.
* Remove `-b` flag since it's now the default build.
* See how templates can be used.
* Rewrite `kdz.js` in Coffeescript.
* Test on Windows machines.
