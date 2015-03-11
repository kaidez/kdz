# ![Alt text](logo-kdz.png)
## kaidez's personal project scaffolding tool
v.0.0.1

kdz is a Node build tool I created for scaffolding out my projects.

Review the actual code in the heavily-commented [`kdz.js`](https://github.com/kaidez/kdz/blob/master/kdz.js) files as well as the JS files in [`config/`](https://github.com/kaidez/kdz/tree/master/config)...also heavily-commented.

### Before you install
kdz is not available as a downloadable npm module so if you want to install it, you will need to clone this repo to your machine first. Therefore, please note the following:

* This tool has been tested on Unix-like systems only. Testing it on Windows machines is listed in the todo section.

* There shouldn't be an npm tool or module called `kdz` already installed on your machine. So you should be able to install it with no issues but just to be sure, run `which kdz` in your terminal. If it doesn't say the file is installed somewhere, you're ok.  If it does, PLEASE LET ME KNOW ASAP!!

* This tool downloads files from a pre-defined root link in `kdz.js` that points to my GitHub repo. If you want to change that link, you would have to change the `githubRoot` variable in [`config/dlFiles.js`](https://github.com/kaidez/kdz/blob/master/config/dlFiles.js).

* I'm assuming that you have Node/npm installed on the machine to which you're downloading this tool. If not, please [get Node & npm](https://nodejs.org/download/).

### How it works
kdz uses a small set of commands and options to scaffold a basic web application based on the methods and tricks I commonly use for web development. It creates files & folders and also downloads specific files from this repo.

### How to install
1. Open a terminal window and clone this repository somewhere on your local machine:

        git clone https://github.com/kaidez/kdz.git

2. Navigate to the repo in your terminal and install it...you may need to do this using `sudo`:

        npm install -g

From here, run `kdz app` whenever you want from whatever folder you want.
### Commands

#### `app`
Running `kdz app` scaffolds out a single-page-application (SPA) by performing the following steps:
<br />
<br />

* a `build` folder is created with `css` and `js` subdirectories.
* a `coffee` folder is created and includes a `main.coffee` file.
* a `css-build` folder is created with an `imports` subdirectory.
* and empty `image-min` folder is created (images that need to be minified go here)
* `bower.json`, `.bowerrc` and `STYLEGUIDE.md` files are downloaded from the `source-shared-files` directory.
* SPA-like `Gruntfile.js`, `gulpfile.js` and `package.json` files are downloaded from the `source-spa` directory.
<br />
<br />

#### `dt`
If the `--test` flag is attached to `kdz app`, a `test-build` folder is created, then a test scaffold is created in that folder. `kdz dt` is a quick way of deleting `test-build`.
<br />
<br />

### Options

#### `-w, --wordpress`
Scaffolds out a WordPress-like project.  It performs almost the same tasks as `kdz app` with the following differences:

* The `build` folder and its subdirectories are not created.
* The `Gruntfile.js`, `gulpfile.js` and `package.json` files that are downloaded are more geared toward WordPress development and downloaded from `source-wordpress`.
* A `functions.php` file is downloaded.
<br />
<br />

#### `-g, --gitignore`
Downloads a `.gitignore` file from `source-spa` to the root folder. If the `-w` option is passed, `.gitignore` will be WordPress-specific and downloaded from the `source-wordpress` folder.
<br />
<br />

#### `-l, --less`
Downloads LESS files from `source-spa` to `css-build` and `css-build/imports` If the `-w` option is passed, the LESS files will be WordPress-specific and downloaded from the `source-wordpress` folder.
<br />  
<br />

#### `-s, --scss`
Downloads Sass files from `source-spa` to `css-build` and `css-build/imports` If the `-w` option is passed, the Sass files will be WordPress-specific and downloaded from the `source-wordpress` folder.
<br />  
<br />

#### `-t, --test`
Creates a folder called `test-build` and creates a test scaffold. `test-build` is listed as "non-commitable" in `.gitignore`.
<br />  
<br />

## General Notes
kdz uses an older version of the [download](https://www.npmjs.com/package/download) module, which is used to download files from my GitHub repo. This is because it currently causes errors when used with the [download-status](https://www.npmjs.com/package/download-status) module, which is displays a progress bar for an individual download....read more about this [here](https://github.com/kevva/download/issues/45). I'll watch for if/when this is fixed, then update it.

## To get help
Type either `kdz` or `kdz --help` in your terminal.  The following will be outputted:

    Usage: kdz [options] [command]


    Commands:

     app   scaffold a basic web application
     dt    delete "test-build" folder

    Options:

    -h, --help       output usage information
    -V, --version    output the version number
    -w, --wordpress  create a WordPress project
    -g, --gitignore  download ".gitignore" file
    -l, --less       download LESS files in "css-build"
    -s, --scss       download Sass files in "css-build"
    -t, --test       do a test scaffold in "test-build"


## TODO/WISH-LIST
kdz is still new so there are some things I'd still like/want to do:
* See how the promises can be made to work better.
* The folder-existence check isn't accurate...make it more accurate.
* Create specific commands for both the LESS and Sass downloads...don't make them work with just an option.
* Perform error handling when flags are passed improperly.
* See how templates can be used.
* Rewrite `kdz.js` in Coffeescript.
* Test on Windows machines.
* See if pointing to GitHub files with the GitHub API is better than pointing to them directly.
* See if a reusable function can be created for tasks related to `fs.open()`.
* Add prompt functionality so things like `package.json` can be customized.
