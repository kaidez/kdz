#!/usr/bin/env node
// Run this task with node

// "use strict";

var fs = require('fs'),
program = require('commander'),
touch = require("touch"),
mkdirp = require('mkdirp'),
Q = require('q'),
shelljs = require("shelljs"),
chalk = require('chalk'),
Download = require('download'),
progress = require('download-status'),
data = require('./config/data.js');

require('shelljs/global');


// if the test flag is passed, cd into the "init-test" directory
function goToTest() {
  var deferred = Q.defer();
  if(program.test) {
    cd("init-test");
    deferred.resolve();
  } else {
    deferred.resolve();
  }
  return deferred.promise;
} //end "goToTest()"


//Create core project directories
function buildFolders() {
  console.log( chalk.green.underline( "Creating project directories...\n" ) );
  ["css-build/imports", "coffee", "image-min"].forEach( function( element ) {
    mkdirp( element );
  });
} //end "buildFolders()"


// Create a "build" folder with "css" & "js" subdirectories
// Check to see if it exists before building out
function buildDir()  {
  fs.open('build', "rs", function(err, fd) {
    console.log( chalk.green.underline( "Creating \"build\"...\n" ) );
    if (err && err.code == 'ENOENT') {
      // If "build/" does not exist
      ["build/css", "build/js", "build/js/libs"].forEach( function( element ) {
        mkdirp( element );
      });
    } else {
      console.log( chalk.red('"build" folder exists...don\'t create a new one.\n' ) );
      fs.close(fd);
    }
  });
} //end "buildDir()"

// create "coffee/main.coffee"
function buildCoffee() {
  console.log(chalk.green.underline("Create CoffeeScript files...\n"));
  cd("coffee");
  touch("main.coffee");
  cd("../");
  return Q.delay(2000);
} //end "buildCoffee()"


function GetFile( file, target ) {

  // Represents the file to be downloaded
  global.file = file;

  // Represents the file's download target
  // In Node, "global" is the same thing as "this"
  global.target = target;

  // Root URL for downloading files from GitHub
  var appDownloadRoot = "https://raw.githubusercontent.com/kaidez/kdz/master/download_source/";

  fs.open(global.file, "rs", function(err, fd) {
    if (err && err.code == 'ENOENT') {
      // If the file does NOT exists, download it
      console.log(chalk.green.underline(">> Download " + global.file + "...\n"));

      var download = new Download( { strip: 1 } )
      .get(  appDownloadRoot + global.file )
      .dest( global.target )
      .use(progress());

      download.run(function (err) {
        if (err) {
          throw err;
        }
      });

    } else {
      console.log( chalk.red( global.file + " exists...don\'t download it.\n" ) );
      fs.close(fd);
    }
  });
} //end "getFile()"


// Helper function for creating CSS preprocessors files
// "opt" will be a preprocessor file type: either "less" or "scss"
function preProcess( opt ) {


  var download = new Download({ extract: true, strip: 1, mode: '755' })
  .get('https://github.com/kaidez/kdz/raw/master/download_source/' + opt + '.zip')
  .dest('css-build/imports')
  .use(progress());

  download.run(function (err, files) {
    if (err) {
      throw err;
    }
  });

}



function buildCoreCssPreprocess( opt ) {
  var download = new Download( { strip: 1 } )
  .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/style.' + opt )
  .dest('css-build/')
  .use(progress());

  download.run(function (err) {
    if (err) {
      throw err;
    }
  });
}



// "app" command: scaffolds out a SPA-like project
program
.command("app")
.description('scaffold a basic web application')
.action(function(){
  goToTest()
  .then(function(){
    buildFolders();
    return Q.delay(2000);
  })
  .then(function(){
    buildCoffee();
  }, function(){ console.log("✘ main.coffee build failed!");})
  .then(function(){
    if(program.build) {
      buildDir();
      return Q.delay(2000);
    }
  }, function(){ console.log("✘ The \"build\" folder didn't build!");})
  .then(function(){
    if(program.gitignore) {
      var gitignore = new GetFile(".gitignore", ".")
      return Q.delay(2000);
    }
  }, function(){ console.log("✘ .gitignore failed to download!");})
  .then(function(){
    var pkg = new GetFile("package.json", ".");
    return Q.delay(2000);
  }, function(){console.log( chalk.red.bold( "✘ package.json failed to download!") );})
  .then(function(){
    var bower = new GetFile("bower.json", ".");
    return Q.delay(2000);
  }, function(){console.log( chalk.red.bold( "✘ bower.json failed to download!") );})
  .then(function(){
    var bowerrc = new GetFile(".bowerrc", ".");
    return Q.delay(2000);
  }, function(){console.log( chalk.red.bold( "✘ .bowerrc failed to download!") );})
  .then(function(){
    var grunt = new GetFile("Gruntfile.js", ".");
    return Q.delay(2000);
  }, function(){console.log( chalk.red.bold( "✘ Gruntfile.gs failed to download!") );})
  .then(function(){
    var gulp = new GetFile("gulpfile.js", ".");
    return Q.delay(2000);
  }, function(){console.log( chalk.red.bold( "✘ gulpfile.js failed to download!") );})
  .then(function(){
    if(program.less) {
      console.log( chalk.green.underline( "Building .less preprocessor files...\n" ) );
      preProcess("less");
    } else if(program.scss){
      console.log( chalk.green.underline( "Building .scss preprocessor files...\n" ) );
      preProcess("sass");
    }
    return Q.delay(2000);
  }, function(){ console.log("✘ CSS preprocess files failed to build!");})
  .then(function(){
    if(program.less) {
      console.log(chalk.green.underline("Download style.less...\n"));
      buildCoreCssPreprocess("less");
    } else if (program.scss) {
      console.log(chalk.green.underline("Download style.scss...\n"));
      buildCoreCssPreprocess("scss");
    }
    return Q.delay(2000);
  }, function(){ console.log("✘ Core preprocess file failed to download!");})
  .done(function(){
    console.log( chalk.yellow.bold.underline( "THE PROJECT IS SCAFFOLDED!!") );
    console.log( chalk.yellow( "Next steps...\n") );
    console.log( chalk.yellow( "1. fill in the following fields in \"package.json\"") );
    console.log( chalk.yellow( "   -name, version, homepage, description, main and git URL\n") );
    console.log( chalk.yellow( "2. fill in the following fields in \"bower.json\"") );
    console.log( chalk.yellow( "   -name, version, homepage, description and main\n") );
    console.log( chalk.yellow( "3. Run \"npm-check-updates\" to check for project modules updates") );
    console.log( chalk.yellow( "4. Run \"bower list\" to check for front-end dependency updates") );
    console.log( chalk.yellow( "5. Run \"npm install\" and \"bower install\"") );

  });
})


// options
program
.version('0.0.1')
.option('-b, --build', 'add "build" folder with subfolders')
.option('-l, --less', 'create LESS files in "css-build"')
.option('-s, --scss', 'create Sass files in "css-build"')
.option('-t, --test', 'do a test scaffold in "init-test"')
.option('-g, --gitignore', 'add ".gitignore" file');

program.parse(process.argv);

// If no arguments or commands are passed, display "help"
if (!program.args.length) program.help();
