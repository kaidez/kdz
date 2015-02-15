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
  console.log( chalk.green( "Creating project directories...\n" ) );
  ["css-build/import", "coffee", "image-min"].forEach( function( element ) {
    mkdirp( element );
  });
  return Q.delay(3000);
} //end "buildFolders()"


// Create a "build" folder with "css" & "js" subdirectories
// Check to see if it exists before building out
function buildDir()  {
  var deferred = Q.defer();
  fs.open('build/', "rs", function(err, fd) {
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
// "opt" will be a preprocessor file type: either "less" or "scss"
function preProcess( opt ) {
  var deferred = Q.defer();
  data["preprocess_files"].forEach(function( element ){
    if (program.less) {
      touch ( element + "." + opt );
    } else if (program.scss){
      touch ( "_" + element + "." + opt );
    }
    deferred.resolve();
  });
  return deferred.promise;
}



function buildCoreCssPreprocess( opt ) {
  var deferred = Q.defer();
  var download = new Download( { strip: 1 } )
  .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/style.' + opt )
  .dest('css-build/')
  .use(progress());

  download.run(function (err) {
    if (err) {
      throw err;
    }
    if(opt == "less") {
      var download = new Download( { strip: 1 } )
      .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/for.less')
      .dest('css-build/import')
      .use(progress());

      download.run(function (err) {
        if (err) {
          throw err;
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
  .use(progress());

  download.run(function (err) {
    if (err) {
      throw err;
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
    if (err) {
      throw err;
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
    if (err) {
      throw err;
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
  console.log(chalk.green("Create CoffeeScript files...\n"));
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
    return Q.delay(2000);
  })
  .then(function(){
    if(program.build) {
      buildDir();
      return Q.delay(2000);
    }
  }, function(){ console.log("✘ The \"build\" folder didn't build!");})
  .then(function(){
    if (program.gitignore) {
      var deferred = Q.defer();
      fs.open('.gitignore', "rs", function(err, fd) {
        if (err && err.code == 'ENOENT') {
          // If ".gitignore" does NOT exist, don't download it again
          getGitignore();
          deferred.resolve();
        } else {
          console.log( chalk.red.bold('".gitignore" exists...don\'t create a new one.\n' ) );
          fs.close(fd);
          deferred.resolve();
        }
        return deferred.promise;
      });
    }
  }, function(){ console.log("✘ .gitignore file failed to download!");})
  .then(function(){
    buildCoffee();
  }, function(){ console.log("✘ main.coffee build failed!");})
  .then(function(){
    if(program.less) {
      cd("css-build/import");
      console.log( chalk.green( "Building .less preprocessor files..." ) );
      preProcess("less");
      cd("../../");
    } else if(program.scss){
      cd("css-build/import");
      console.log( chalk.green( "Building .scss preprocessor files..." ) );
      preProcess("scss");
      cd("../../");
    }
    return Q.delay(2000);
  }, function(){ console.log("✘ CSS preprocess files failed to build!");})
  .then(function(){
    console.log(chalk.green("Start downloading core preprocesser stylesheet..."));
    return Q.delay(2000);
  })
  .then(function(){
    if(program.less) {
      buildCoreCssPreprocess("less");
    } else if (program.scss){
      buildCoreCssPreprocess("scss");
    }
    return Q.delay(2000);
  }, function(){ console.log("✘ Core preprocess file failed to download!");})
  .then(function(){
    console.log(chalk.green("Download package.json & bower.json...\n"));
    return Q.delay(2000);
  })
  .then(function(){
    var deferred = Q.defer();
    fs.open('package.json', "rs", function(err, fd) {
      if (err && err.code == 'ENOENT') {
        // If "package.json" does NOT exist, don't download it again
        getPackage();
        deferred.resolve();
      } else {
        console.log( chalk.red.bold('"package.json" exists...don\'t create a new one.\n' ) );
        fs.close(fd);
        deferred.resolve();
      }
      return deferred.promise;
    });
  }, function(){ console.log("✘ package.json failed to download!");})
  .then(function(){
    var deferred = Q.defer();
    fs.open('bower.json', "rs", function(err, fd) {
      if (err && err.code == 'ENOENT') {
        // If "bower.json" does not exist
        getBower();
        deferred.resolve();
      } else {
        console.log( chalk.red.bold('"bower.json" exists...don\'t create a new one.\n' ) );
        fs.close(fd);
        deferred.resolve();
      }
      return deferred.promise;
    });
  }, function(){ console.log("✘ bower.json failed to download!");})

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
.option('-g, --gitignore', 'add ".gitignore" file')
.option('-l, --less', 'create LESS files in "css-build"')
.option('-s, --scss', 'create Sass files in "css-build"')
.option('-t, --test', 'do a test scaffold in "init-test"');

program.parse(process.argv);

// If no arguments or commands are passed, display "help"
if (!program.args.length) program.help();
