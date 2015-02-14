#!/usr/bin/env node
// Run this task with node

"use strict";

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


function goToTest() {
  var deferred = Q.defer();
  if(program.test) {
    cd("init-test");
    deferred.resolve();
  } else {
    deferred.resolve();
  }
  return deferred.promise;
}


//Create core project directories
function buildFolders() {
  console.log( chalk.yellow.underline( "Creating project directories...\n" ) );
  ["css-build/import", "coffee", "image-min"].forEach( function( element ) {
    mkdirp( element );
  });
  return Q.delay(3000);
} //end "buildFolders()"


// Create a "build" folder with "css" & "js" subdirectories
// Check to see if it exists before building out
function buildDir()  {
  var deferred = Q.defer();
  fs.open('build/', "r", function(err, fd) {
    if (err && err.code == 'ENOENT') {
      // If "build/" does not exist
      ["build/css", "build/js", "build/js/libs"].forEach( function( element ) {
        mkdirp( element );
      });
    } else {
      console.log( chalk.red.bold('"build" folder exists...don\'t create a new one.\n' ) );
      fs.close(fd);
    }
    deferred.resolve();
  });
  return deferred.promise;
}



// Helper function for creating CSS preprocessors files
// "opt" will be a preprocessor file type: either "less" or "sass"
function preProcess( opt ) {
  var deferred = Q.defer();
  console.log( chalk.yellow.underline( "Building ." + opt + " preprocessor files..." ) );
  data["preprocess_files"].forEach(function( element ){
    if (program.less) {
      touch ( element + "." + opt );
    } else {
      touch ( "_" + element + "." + opt );
    }
  });
}



function buildCore( opt ) {
  var deferred = Q.defer();
  var download = new Download( { strip: 1 } )
    .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/style.' + opt )
    .dest('css-build/')
    .use(progress());

  download.run(function (err) {
    console.log(chalk.green("Start downloading style." + opt + "..."));
    if (err) {
      throw err;
    } else {
      console.log(chalk.yellow.underline("✔ style." + opt + " downloaded successfully!\n"));
    }
    if(opt == "less") {
      var download = new Download( { strip: 1 } )
        .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/for.less')
        .dest('css-build/import');

      download.run(function (err) {
        console.log(chalk.green("Start downloading for.less..."));
        if (err) {
          throw err;
        } else {
          console.log(chalk.yellow.underline("✔ for.less downloaded successfully!\n"));
        }
      });
    }
    deferred.resolve();
  });
  return deferred.promise;
}







// Helper function for downloading my core "package.json" file
function getPackage() {
  var deferred = Q.defer();
  var download = new Download( { strip: 1 } )
    .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/package.json')
    .dest('.')
    .use(progress());;

  download.run(function (err) {
    console.log(chalk.green("Start downloading package.json..."));
    if (err) {
      throw err;
    } else {
      console.log(chalk.yellow.underline("✔ package.json downloaded successfully!\n"));
    }

    deferred.resolve();
  });
  return deferred.promise;
}


// Helper function for downloading my core "bower.json" file
function getBower() {
  var deferred = Q.defer();
  var download = new Download( { strip: 1 } )
    .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/bower.json')
    .dest('.')
    .use(progress());

  download.run(function (err) {
    console.log(chalk.green("Download bower.json..."));
    if (err) {
      throw err;
    } else {
      console.log(chalk.yellow.underline("✔ bower.json downloaded successfully!\n"));
    }

    deferred.resolve();
  });
  return deferred.promise;
}


// Helper function for downloading core "bootstrap.css" file
function getGitignore() {
  var deferred = Q.defer();
  var download = new Download( { strip: 1 } )
      .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/.gitignore')
    .dest('.')
    .use(progress());

  download.run(function (err) {
    console.log(chalk.green("Start downloading .gitignore..."));
    if (err) {
      throw err;
    } else {
      console.log(chalk.yellow.underline("✔ .gitignore downloaded successfully!\n"));
    }
    deferred.resolve();
  });
  return deferred.promise;
}

// Check to see if a "build" folder exixs before creating one
function runBuildFolderTest() {
  var deferred = Q.defer();
  if (program.build) {
    buildDir();
    deferred.resolve();
  }
  return deferred.promise;
}

function buildCoffee() {
  console.log(chalk.yellow.underline("Create CoffeeScript files...\n"));
  cd("coffee");
  touch("main.coffee");
  cd("../");
  return Q.delay(3000);
}

program
  .command('init')
  .description('scaffold the project')
  .action(function(){
    goToTest()
    .then(function(){
      buildFolders();
    })
    .then(function(){
      buildCoffee();
    }, function(){ console.log("✘ main.coffee build failed!");})
    .then(function(){
      fs.open('package.json', "r", function(err, fd) {
        if (err && err.code == 'ENOENT') {
          // If "package.json" does not exist
          getPackage();
        } else {
          console.log( chalk.red.bold('"package.json" folder exists...don\'t create a new one.\n' ) );
          fs.close(fd);
        }
      });
    }, function(){ console.log("✘ package.json failed to download!");})
    .then(getBower, function(){ console.log("✘ bower.json failed to download!");})
    .then(function(){
      fs.open('.gitignore', "r", function(err, fd) {
        if (err && err.code == 'ENOENT') {
          // If ".gitignore" does not exist
          getGitignore();
        } else {
          console.log( chalk.red.bold('".gitignore" exists...don\'t create a new one.\n' ) );
          fs.close(fd);
        }
      });
    }, function(){ console.log("✘ .gitignore failed to download!");})
    .then(function(){
      cd("css-build/import");
      if(program.less) {
        preProcess("less");
      } else {
        preProcess("scss");
      }
      cd("../../");
    }, function(){ console.log("✘ CSS preprocess files failed to build!");})
    .then(function(){
      console.log(chalk.yellow.underline("CSS preprocess files downloaded successfully!\n"));
    })
    .then(function(){
      if(program.less) {
        buildCore("less");
      } else {
        buildCore("scss");
      }
    }, function(){ console.log("✘ Core preprocess file failed to download!");})
    .then(function(){
      if(program.build) {
        buildDir();
      }
    })
  });

// "build" command: creates a "build" folder
// Kinda useless right now...may bring back later
// program
//   .command("build")
//   .description("add \"build\" folder with subfolders")
//   .action(function() {
//     goToTest()
//     .then(buildDir)
//   })


// options
program
  .version('0.0.1')
  .option('-b, --build', 'add "build" folder with subfolders')
  .option('-l, --less', 'create .less files in "css-build"')
  .option('-s, --sass', 'create .scss files in "css-build"')
  .option('-t, --test', 'do a test scaffold in "init-test"');

program.parse(process.argv);

// If no arguments or commands are passed, display "help"
if (!program.args.length) program.help();
