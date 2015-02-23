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
  }
  return deferred.promise;
}


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
  fs.open('build/', "rs", function(err, fd) {
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
}



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







// Helper function for downloading my core "package.json" file
function getPackage() {
  var download = new Download( { strip: 1 } )
  .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/package.json')
  .dest('.')
  .use(progress());

  download.run(function (err) {
    if (err) {
      throw err;
    }
  });
}


// Helper function for downloading my core "package.json" file
function getGrunt() {
  var download = new Download( { strip: 1 } )
  .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/Gruntfile.js')
  .dest('.')
  .use(progress());

  download.run(function (err) {
    if (err) {
      throw err;
    }
  });
}
// Helper function for downloading my core "gulpfile.js" file
function getGulp() {
  var download = new Download( { strip: 1 } )
  .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/gulpfile.js')
  .dest('.')
  .use(progress());

  download.run(function (err) {
    if (err) {
      throw err;
    }
  });
}

// Helper function for downloading my core "gulpfile.js" file
function getBowerrc() {
  var download = new Download( { strip: 1 } )
  .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/.bowerrc')
  .dest('.')
  .use(progress());

  download.run(function (err) {
    if (err) {
      throw err;
    }
  });
}




// Helper function for downloading my core "bower.json" file
function getBower() {
  var download = new Download( { strip: 1 } )
  .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/bower.json')
  .dest('.')
  .use(progress());

  download.run(function (err) {
    if (err) {
      throw err;
    }
  });
}


// Helper function for downloading core "bootstrap.css" file
function getGitignore() {
  var download = new Download( { strip: 1 } )
  .get('https://raw.githubusercontent.com/kaidez/kdz/master/download_source/.gitignore')
  .dest('.')
  .use(progress());

  download.run(function (err) {
    if (err) {
      throw err;
    }
  });
}

// Check to see if a "build" folder exixs before creating one
function runBuildFolderTest() {
  if (program.build) {
    buildDir();
  }
  return deferred.promise;
}

function buildCoffee() {
  console.log(chalk.green.underline("Create CoffeeScript files...\n"));
  cd("coffee");
  touch("main.coffee");
  cd("../");
  return Q.delay(1000);
}

program
.command('init')
.description('scaffold the project')
.action(function(){
  goToTest()
  .then(function(){
    buildFolders();
    return Q.delay(1000);
  })
  .then(function(){
    if(program.build) {
      buildDir();
      return Q.delay(1000);
    }
  }, function(){ console.log("✘ The \"build\" folder didn't build!");})
  .then(function(){
    if (program.gitignore) {
      fs.open('.gitignore', "rs", function(err, fd) {
        if (err && err.code == 'ENOENT') {
          // If ".gitignore" does NOT exist, download it
          console.log(chalk.green.underline("Download .gitignore...\n"));
          getGitignore();
        } else {
          console.log( chalk.red('".gitignore" exists...don\'t download it.\n' ) );
          fs.close(fd);
        }
      });
    }
    return Q.delay(1000);
  }, function(){ console.log("✘ .gitignore file failed to download!");})
  .then(function(){
    buildCoffee();
  }, function(){ console.log("✘ main.coffee build failed!");})
  .then(function(){
    if(program.less) {
      console.log( chalk.green.underline( "Building .less preprocessor files...\n" ) );
      preProcess("less");
    } else if(program.scss){
      console.log( chalk.green.underline( "Building .scss preprocessor files...\n" ) );
      preProcess("sass");
    }
    return Q.delay(1000);
  }, function(){ console.log("✘ CSS preprocess files failed to build!");})
  .then(function(){
    if(program.less) {
      console.log(chalk.green.underline("Download style.less...\n"));
      buildCoreCssPreprocess("less");
    } else if (program.scss) {
      console.log(chalk.green.underline("Download style.scss...\n"));
      buildCoreCssPreprocess("scss");
    }
    return Q.delay(1000);
  }, function(){ console.log("✘ Core preprocess file failed to download!");})
  .then(function(){
    fs.open('gulpfile.js', "rs", function(err, fd) {
      if (err && err.code == 'ENOENT') {
        // If "gulpfile.js" does NOT exist, download it
        console.log(chalk.green.underline("Download gulpfile.js...\n"));
        getGulp();
      } else {
        console.log( chalk.red('"gulpfile.js" exists...don\'t download it.\n' ) );
        fs.close(fd);
      }
    });
    return Q.delay(1000);
  }, function(){ console.log("✘ gulpfile.js failed to download!");})
  .then(function(){
    fs.open('.bowerrc', "rs", function(err, fd) {
      if (err && err.code == 'ENOENT') {
        // If ".bowerrc" does NOT exist, download it
        console.log(chalk.green.underline("Download .bowerrc...\n"));
        getBowerrc();
      } else {
        console.log( chalk.red('".bowerrc" exists...don\'t download it.\n' ) );
        fs.close(fd);
      }
    });
    return Q.delay(1000);
  }, function(){ console.log("✘ .bowerrc failed to download!");})
  .then(function(){
    fs.open('Gruntfile.js', "rs", function(err, fd) {
      if (err && err.code == 'ENOENT') {
        // If "Gruntfile.js" does NOT exist, download it
        console.log(chalk.green.underline("Download Gruntfile.js...\n"))
        getGrunt();
      } else {
        console.log( chalk.red('"Gruntfile" exists...don\'t download it.\n' ) );
        fs.close(fd);
      }
    });
    return Q.delay(1000);
  }, function(){ console.log("✘ Gruntfile.js failed to download!");})
  .then(function(){
    fs.open('package.json', "rs", function(err, fd) {
      if (err && err.code == 'ENOENT') {
        // If "package.json" does NOT exist, download it
        console.log(chalk.green.underline("Download package.json..\n"));
        getPackage();
      } else {
        console.log( chalk.red('"package.json" exists...don\'t download it.\n' ) );
        fs.close(fd);
      }
    });
    return Q.delay(1000);
  }, function(){ console.log("✘ package.json failed to download!");})
  .then(function(){
    fs.open('bower.json', "rs", function(err, fd) {
      if (err && err.code == 'ENOENT') {
        // If "bower.json" does not exist, download it
        console.log(chalk.green.underline("Download bower.json...\n"));
        getBower();
      } else {
        console.log( chalk.red('"bower.json" exists...don\'t download it.\n' ) );
        fs.close(fd);
      }
    });
    return Q.delay(1000);
  }, function(){console.log( chalk.red.bold( "✘ bower.json failed to download!") );})
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
