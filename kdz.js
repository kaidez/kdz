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


//Create a "build" folder with "css" & "js" subdirectories
function buildDir() {
  console.log(chalk.yellow.underline("Creating build folders...\n"));
  var deferred = Q.defer();
  setTimeout(function(){
    ["build/css", "build/js/libs"].forEach(function(element){
      mkdirp(element);
    });
    deferred.resolve();
  }, 3000)
  return deferred.promise;
}; // end "buildDir()"


// Helper function for creating CSS preprocessors files
// "opt" will be a preprocessor file type: either "less" or "sass"
function preProcess(opt){
  data["preprocess_files"].forEach(function(element){
    touch(element+"."+opt)
  });
}



// Helper function for downloading my core "bower.json" file
function getPackage() {
  var deferred = Q.defer();
  var download = new Download({ strip: 1, mode: '755' })
    .get('https://raw.githubusercontent.com/kaidez/kdz/master/package.json')
    .dest('./test')
    .use(progress());

  download.run(function (err, files, stream) {
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
  var download = new Download({ strip: 1, mode: '755' })
    .get('https://raw.githubusercontent.com/kaidez/kdz/master/bower.json')
    .dest('.')
    .use(progress());

  download.run(function (err, files, stream) {
    if (err) {
      throw err;
    }

    deferred.resolve();
  });
  return deferred.promise;
}

// Helper function for downloading my core "bower.json" file
function getBootstrap() {
  var deferred = Q.defer();
  var download = new Download({ strip: 1, mode: '755' })
    .get('https://raw.githubusercontent.com/twbs/bootstrap/master/dist/css/bootstrap.css')
    .dest('./css-build')
    .use(progress());

  download.run(function (err, files, stream) {
    if (err) {
      throw err;
    }

    deferred.resolve();
  });
  return deferred.promise;
}

// "init" command
program
  .command('init')
  .description('scaffold the project')
  .action(function(){
    buildFolders().then(function(){
      console.log(chalk.yellow.underline("Create CoffeeScript files...\n"));
      cd("coffee");
      touch("main.coffee");
      cd("../");
    }).then(function(){
      console.log(chalk.yellow.underline("Building CSS preprocessors files...\n"));
      cd("css-build/import");
      if(program.less) {
        preProcess("less");
      } else {
        if (program.sass) {
          preProcess("scss");
        }
      }
      cd("../../");
    })
    .then(getPackage)
    .then(function(){
      console.log(chalk.yellow.underline("package.json downloaded successfully!\n"));
    })
    .then(getBower)
    .then(function(){
      console.log(chalk.yellow.underline("bower.json downloaded successfully!\n"));
    })
    .then(getBootstrap)
    .then(function(){
      console.log(chalk.yellow.underline("bootstrap.css.json downloaded successfully!\n"));
    })
    .then(function(){
      if(program.build) {
        if(!fs.existsSync("build")) {
          buildDir();
        } else {
          return console.log(chalk.red.bold('You already have a "build" folder...a new one will not be built.\n'));
        }
      }
    })
  });

program
  .command("build")
  .description("add 'build' folder with subfolders")
  .action(function(){
    if(program.build) {
      if(!fs.existsSync("build")) {
        buildDir();
      } else {
        return console.log(chalk.red.bold('You already have a "build" folder so a new one will not be built.\n'));
      }
    }
  })

// options
program
  .version('0.0.1')
  .option('-b, --build', 'add "build/" folder with subfolders')
  .option('-l, --less', 'create .less files in "css-build/')
  .option('-s, --sass', 'create .scss files in "css-build/');

program.parse(process.argv);

// If no arguments or commands are passed, display "help"
if (!program.args.length) program.help();
