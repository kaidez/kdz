# ![Alt text](logo-kdz.png)
## kaidez's personal project scaffolding tool
v.0.0.1

kdz is a Node build tool I created for scaffolding out my projects.

Review the actual code in the heavily-commented [`kdz.js`](https://github.com/kaidez/kdz/blob/master/kdz.js).

### Before you install
kdz is not available as a downloadable npm module so if you want to install it, you will need to clone this repo to your machine first. This means that some assumptions are made:

* This tool has been tested on Unix-like systems only. Testing it on Windows machines is listed in the todo section.

* There shouldn't be an npm tool or module called `kdz` already installed on your machine. So you should be able to install it with no issues but just to be sure, run `which kdz` in your terminal. If it doesn't say the file is installed somewhere, you're ok.  If it does, PLEASE LET ME KNOW ASAP!!

* This tool downloads files from a pre-defined root link in `kdz.js` that points to my GitHub repo. If you want to change that link, you would have to do that [here](https://github.com/kaidez/kdz/blob/master/kdz.js#L28).

### How to install
1. Open a terminal window and clone this repository somewhere on your local machine:

        git clone https://github.com/kaidez/kdz.git

2. Navigate to the repo in your terminal and install it...you may need to do this using `sudo`:

        npm install -g

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
* a `build` folder is created with `css` and `js` subdirectories.
* a `coffee` folder is created and includes a `main.coffee` file.
* a `css-build` folder is created with an `imports` subdirectory.
* and empty `image-min` folder is created (images that need to be minified go here)
* `bower.json`, `.bowerrc` and `STYLEGUIDE.md` files are downloaded.
* SPA-like `Gruntfile.js`, `gulpfile.js` and `package.json` files are downloaded.

### Options
kdz comes with a small set of options:

#### `-w, --wordpress`
Scaffolds out a WordPress-like project.  It performs almost the same tasks as `kdz app` with the following differences:

* The `build` folder and its subdirectories are not created.
* The `Gruntfile.js`, `gulpfile.js` and `package.json` files that are downloaded are more geared toward WordPress development.
<br />
<br />

#### `-g, --gitignore`
Downloads a `.gitignore` file to the root folder. If the `-w` option is passed, `.gitignore` will be WordPress-specific.
<br />
<br />

#### `-l, --less`
Downloads LESS files to `css-build` and `css-build/imports` If the `-w` option is passed, the LESS files will be WordPress-specific.
<br />  
<br />

#### `-s, --scss`
Downloads Sass files to `css-build` and `css-build/imports` If the `-w` option is passed, the Sass files will be WordPress-specific.
<br />  
<br />

#### `-t, --test`
Creates a test folder for where you can test your scaffold...this is more for my testing while developing.
<br />  
<br />

#### `-b, --build`
Does the same thing as `kdz app`. This is redundant so it will probably be deleted at some point.
<br />  
<br />

## GENERAL NOTES
kdz uses an older version of the [download](https://www.npmjs.com/package/download) module, which is used to download files from my GitHub repo. This is because it currently causes errors when used with the [download-status](https://www.npmjs.com/package/download-status) module, which is displays a progress bar for an individual download....read more about this [here](https://github.com/kevva/download/issues/45). I'll watch for if/when this is fixed.

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
* Add prompt functionality so things like `package.json` can be customized
