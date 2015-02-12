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
function buildFolders(){
  console.log(chalk.yellow.underline("Creating project directories...\n"));
  ["css-build/import", "coffee", "image-min"].forEach(function(element){
    mkdirp(element);
  });
  return Q.delay(3000);
} //end "buildFolders()"

function goToTest() {
  cd("init-test");
  return Q.delay(3000);
}

//Create a "build" folder with "css" & "js" subdirectories
function buildDir() {
  var deferred = Q.defer();
  if(!fs.existsSync("build")) {
    ["build/css", "build/js/libs"].forEach(function(element){
      mkdirp(element);
    });
    deferred.resolve();
  } else {
    console.log(chalk.red.bold('You already have a "build" folder so a new one will not be built.\n'))
    deferred.resolve();
  }
  return deferred.promise;
} // end "buildDir()"



// Helper function for creating CSS preprocessors files
// "opt" will be a preprocessor file type: either "less" or "sass"
function preProcess(opt){
  var deferred = Q.defer();
  console.log(chalk.yellow.underline("Building ." + opt + " preprocessor files...\n"));
  data["preprocess_files"].forEach(function(element){
    touch(element+"."+opt)
    deferred.resolve();
  });
  return deferred.promise;
}



// Helper function for downloading my core "package.json" file
function getPackage() {
  var deferred = Q.defer();
  var download = new Download({ strip: 1 })
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
  var download = new Download({ strip: 1 })
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
  var download = new Download({ strip: 1 })
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



function runTests() {
  var deferred = Q.defer();
  var test = program.test;
  var build = program.build;
  if (build && test) {
    goToTest()
    buildDir();
    deferred.resolve();
  } else if (test) {
    goToTest()
    deferred.resolve()
  } else if (build) {
    buildDir();
    deferred.resolve()
  } else {
    deferred.resolve()
  }
  return deferred.promise;
}

program
  .command('init')
  .description('scaffold the project')
  .action(function(){
    runTests()
    .then(function(){
      buildFolders()
    }).then(function(){
      console.log(chalk.yellow.underline("Create CoffeeScript files...\n"));
      cd("coffee");
      touch("main.coffee");
      cd("../");
    })
    .then(function(){
      console.log(chalk.green("Download package.json...\n"));
    })
    .then(function(){
      if (fs.existsSync("package.json")) {
        return console.log(chalk.red.bold('You already have a "package.json" file...a new one will not be built.\n'));
      } else {
         getPackage();
      }
    })
    .then(function(){
      console.log(chalk.yellow.underline("package.json downloaded successfully!\n"));
    })
    .then(function(){
      console.log(chalk.green("Download bower.json...\n"));
    })
    .then(getBower)
    .then(function(){
      console.log(chalk.yellow.underline("bower.json downloaded successfully!\n"));
    })
    .then(function(){
      console.log(chalk.green("Download bootstrap.css...\n"));
    })
    .then(getBootstrap)
    .then(function(){
      console.log(chalk.yellow.underline("bootstrap.css downloaded successfully!\n"));
    })
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
    })
  });


// program
//   .command('init')
//   .description('scaffold the project')
//   .action(function(){
//     changeDirectory()
//     .then(function(){
//       if(program.build) {
//         testForBuild();
//       }
//     })
//     .then(buildFolders)
//     .then(function(){
//       console.log(chalk.yellow.underline("Create CoffeeScript files...\n"));
//       cd("coffee");
//       touch("main.coffee");
//       cd("../");
//     })
//     .then(function(){
//       console.log(chalk.yellow.underline("Building CSS preprocessors files...\n"));
//       cd("css-build/import");
//       if(program.less) {
//         preProcess("less");
//       } else {
//         if (program.sass) {
//           preProcess("scss");
//         }
//       }
//         cd("../../");
//       })
//       .then(function(){
//         console.log(chalk.green("Download package.json...\n"));
//       })
//       .then(function(){
//         if (fs.existsSync("package.json")) {
//           return console.log(chalk.red.bold('You already have a "package.json" file...a new one will not be built.\n'));
//         } else {
//           getPackage();
//         }
//       })
//       .then(function(){
//         console.log(chalk.yellow.underline("package.json downloaded successfully!\n"));
//       })
//       .then(function(){
//         console.log(chalk.green("Download bower.json...\n"));
//       })
//       .then(getBower)
//       .then(function(){
//         console.log(chalk.yellow.underline("bower.json downloaded successfully!\n"));
//       })
//       .then(function(){
//         console.log(chalk.green("Download bootstrap.css...\n"));
//       })
//       .then(getBootstrap)
//       .then(function(){
//         console.log(chalk.yellow.underline("bootstrap.css downloaded successfully!\n"));
//       })
//     });

// TODO:
// Configure "build" to check to see if the "-t" option is passed
// If it is, do a CD to "to init-test" before running the command

// program
//   .command("build")
//   .description("add \"build\" folder with subfolders")
//   .action(function(){
//     changeDirectory()
//     .then(function(){
//       if(program.build) {
//         testForBuild();
//       }
//     })
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
