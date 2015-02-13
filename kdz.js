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
    prompt = require('prompt'),
    data = require('./config/data.js');

require('shelljs/global');


//Create core project directories
function buildFolders() {
  console.log( chalk.yellow.underline( "Creating project directories...\n" ) );
  ["css-build/import", "coffee", "image-min"].forEach( function( element ) {
    mkdirp( element );
  });
  return Q.delay(3000);
} //end "buildFolders()"

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

//Create a "build" folder with "css" & "js" subdirectories
// function buildDir() {
//   var deferred = Q.defer();
//   if( !fs.existsSync( "build" ) ) {
//     ["build/css", "build/js/libs"].forEach(function(element){
//       mkdirp( element );
//     });
//     deferred.resolve();
//   } else {
//     console.log( chalk.red.bold('"build" folder exists...don\'t create a new one.\n' ) );
//     deferred.resolve();
//   }
//   return deferred.promise;
// } // end "buildDir()"

function buildDir()  {
  var deferred = Q.defer();
  fs.open('build/', "r", function(err, fd) {
    if (err && err.code == 'ENOENT') {
      // Does not exist
        mkdirp("build/css");
        mkdirp("build/js");
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
  console.log( chalk.yellow.underline( "Building ." + opt + " preprocessor files...\n" ) );
  data["preprocess_files"].forEach(function( element ){
    touch ( element + "." + opt );
    deferred.resolve();
  });
  return deferred.promise;
}



// Helper function for downloading my core "package.json" file
function getPackage() {
  var deferred = Q.defer();
  var download = new Download( { strip: 1 } )
    .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/package.json')
    .dest('.');

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
    .dest('.');

  download.run(function (err) {
    if (err) {
      throw err;
    }

    deferred.resolve();
  });
  return deferred.promise;
}

// Helper function for downloading core "bootstrap.css" file
function getBootstrap() {
  var deferred = Q.defer();
  var download = new Download( { strip: 1 } )
    .get('https://raw.githubusercontent.com/twbs/bootstrap/master/dist/css/bootstrap.css')
    .dest('./css-build');

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
    .dest('.');

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
      console.log(chalk.green("Download package.json..."));
      return Q.delay(3000);
    }, function(){ console.log("✘ This step failed!");})
    .then(function(){
      if (fs.existsSync("package.json")) {
        console.log(chalk.red.bold('package.json" exists...not downloading.\n'));
        return Q.delay( 3000 );
      } else {
        getPackage()
        .then(function(){
          console.log(chalk.yellow.underline("✔ package.json downloaded successfully!\n"));
        }, function(){ console.log("✘ This step failed!");});
      }
    })
    .then(function(){
      console.log(chalk.green("Download bower.json..."));
    }, function(){ console.log("✘ This step failed!");})
    .then(getBower)
    .then(function(){
      console.log(chalk.yellow.underline("✔ bower.json downloaded successfully!\n"));
    }, function(){ console.log("✘ This step failed!");})
    .then(function(){
      console.log(chalk.green("Download bootstrap.css..."));
    }, function(){ console.log("✘ This step failed!");})
    .then(getBootstrap, function(){ console.log("✘ This step failed!");})
    .then(function(){
      console.log(chalk.yellow.underline("✔ bootstrap.css downloaded successfully!\n"));
    }, function(){ console.log("✘ This step failed!");})
    .then(function(){
      console.log(chalk.green("Download .gitignore..."));
    }, function(){ console.log("✘ This step failed!");})
    .then(function(){
      if (fs.existsSync(".gitignore")) {
        console.log(chalk.red.bold('".gitignore" exists...not downloading.\n'));
      } else {
        getGitignore()
       .then(console.log(chalk.yellow.underline("✔ .gitignore downloaded successfully!\n")));
      }
    }, function(){ console.log(chalk.red.bold("✘ .gitignore failed to download!"));})
    .then(function(){
      if(program.less) {
        cd("css-build/import");
        preProcess("less");
      } else {
        if (program.sass) {
          cd("css-build/import");
          preProcess("scss");
        }
      }
      cd("../../");
    }, function(){ console.log("✘ This step failed!");})
    .then(function(){
      if(program.build) {
        mkdirp("build/")
      }
    })
  });

// "build" command: creates a "build" folder
program
  .command("build")
  .description("add \"build\" folder with subfolders")
  .action(buildDir)

program
  .command("test")
  .description("add \"build\" folder with subfolders")
  .action(buildDir)


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
