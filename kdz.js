#!/usr/bin/env node
// Run this task with Node


"use strict"; // use ES5 when possible


// Bring in Node modules
var fs = require( 'fs' ),
    program = require( 'commander' ),
    touch = require('touch'),
    mkdirp = require( 'mkdirp' ),
    Q = require( 'q' ),
    shelljs = require( 'shelljs' ),
    chalk = require( 'chalk' ),
    Download = require( 'download' ),
    progress = require( 'download-status' ),
    data = require( './config/data.js' );

require( 'shelljs/global' );


// If the "test" flag is passed, cd into the "init-test" directory
function goToTest() {
  var deferred = Q.defer();
  if( program.test ) {
    cd( 'init-test' );
    deferred.resolve();
  } else {
    deferred.resolve();
  }
  return deferred.promise;
} //end "goToTest()"


// Create core project directories when "kdz app" is run
function buildFolders() {
  console.log( chalk.green.underline( '>> Creating project directories...\n' ) );
  ['css-build/imports', 'coffee', 'image-min'].forEach( function( element ) {
    mkdirp( element );
  });
} //end 'buildFolders()'


// If the "build" flag is passed, create a "build/" folder
// Place "css/" & "js/" subdirectories inside of it.
function buildDir()  {

  // Use Node fs.open to check if the folder exists before making it
  fs.open( 'build', 'rs', function(err, fd) {
    console.log( chalk.green.underline( '>> Creating \"build\" folder...\n' ) );
    if ( err && err.code == 'ENOENT' ) {

      // If "build/" does NOT exist, create it & its subdirectories
      ['build/css', 'build/js', 'build/js/libs'].forEach( function( element ) {
        mkdirp( element );
      });
    } else {

      // If "build" DOES exist, don't create it
      // Pass a console message syaing it exists & stop the fs process
      console.log( chalk.red( '"build" folder exists...don\'t create a new one.\n' ) );
      fs.close( fd );
    }
  });
} //end "buildDir()"


// Step 1: go to the "coffee" directory
// Step 2: create "main.coffee" inside of "coffee"
// Step 3: go back up to the root folder
function buildCoffee() {
  console.log( chalk.green.underline( '>> Creating "coffee/main.coffee"...\n' ) );
  cd( 'coffee' );
  touch( 'main.coffee' );
  cd( '../' );
  return Q.delay( 2000 );
} //end "buildCoffee()"


/*
 * "GetFile()" function
 * =====================================================================
 *
 */
function GetFile( file ) {

  // Represents the file to be downloaded
  global.file = file;

  // Root URL for downloading files from GitHub
  var fileDownload = 'https://raw.githubusercontent.com/kaidez/kdz/master/download_source/' + global.file;

  // Use Node fs.open to check if the file exists before downloading it
  fs.open( global.file, 'rs', function( err, fd ) {
    if ( err && err.code == 'ENOENT' ) {

      // If the file does NOT exists, download it
      console.log( chalk.green.underline( '>> Download ' + global.file + '...\n' ) );

      var download = new Download( { strip: 1 } )
      .get( fileDownload )
      .dest( '.' )
      .use( progress() );

      download.run( function ( err ) {
        if ( err ) {
          throw err;
        }
      });

    } else {
      console.log( chalk.red( global.file + ' exists...don\'t download it.\n' ) );
      fs.close( fd );
    }
  });
} //end "GetFile()"


// Helper function for creating CSS preprocessors files
// "opt" will be a preprocessor file type: either "less" or "scss"
function preProcess( opt ) {
  var download = new Download( { extract: true, strip: 1, mode: '755' } )
  .get( 'https://github.com/kaidez/kdz/raw/master/download_source/' + opt + '.zip' )
  .dest( 'css-build/imports' )
  .use( progress() );

  if(program.less) {
    console.log( chalk.green.underline( '>> Download .less preprocessor files...\n' ) );
  } else if(program.scss){
    console.log( chalk.green.underline( '>> Download .scss preprocessor files...\n' ) );
  }

  download.run( function ( err, files ) {
    if ( err ) {
      throw err;
    }
  });
} // end "preProcess()"


function buildCoreCssPreprocess( opt ) {
  var download = new Download( { strip: 1 } )
  .get( 'https://raw.githubusercontent.com/kaidez/kdz/master/download_source/style.' + opt )
  .dest( 'css-build/' )
  .use( progress() );


  if( program.less ) {
    console.log( chalk.green.underline( '>> Download style.less...\n' ) );
  } else if ( program.scss ) {
    console.log( chalk.green.underline( '>> Download style.scss...\n' ) );
  }
  download.run(function ( err ) {
    if ( err ) {
      throw err;
    }
  });
} // end "buildCoreCssPreprocess()"


// Output a console message after "app" is done
function doneMessage() {
  console.log( chalk.yellow.bold.underline( 'THE PROJECT IS SCAFFOLDED!!') );
  console.log( chalk.yellow( 'Next steps...\n') );
  console.log( chalk.yellow( '1. fill in the following fields in \"package.json\"') );
  console.log( chalk.yellow( '   -name, version, homepage, description, main and git URL\n') );
  console.log( chalk.yellow( '2. fill in the following fields in \"bower.json\"') );
  console.log( chalk.yellow( '   -name, version, homepage, description and main\n') );
  console.log( chalk.yellow( '3. Run \"npm-check-updates\" to check for project modules updates') );
  console.log( chalk.yellow( '4. Run \"bower list\" to check for front-end dependency updates') );
  console.log( chalk.yellow( '5. Run \"npm install\" and \"bower install\"') );
} // end "doneMessage()"


// "app" command: scaffolds out a SPA-like project
program
.command( 'app' )
.description( 'scaffold a basic web application' )
.action(function() {
  goToTest()
  .then(function() {
    buildFolders();
    return Q.delay( 2000 );
  })
  .then(buildCoffee, function() { console.log( '✘ main.coffee build failed!' );})
  .then(function() {
    if( program.build ) {
      buildDir();
      return Q.delay( 2000 );
    }
  }, function() { console.log( '✘ The "build" folder didn\'t build!' );} )
  .then(function() {
    if( program.gitignore ) {
      var gitignore = new GetFile( '.gitignore' )
      return Q.delay( 2000 );
    }
  }, function() { console.log( '✘ .gitignore failed to download!' );} )
  .then(function() {
    if( program.less ) {
      preProcess( 'less' );
    } else if( program.scss ) {
      preProcess( 'sass' );
    }
    return Q.delay( 2000 );
  }, function() { console.log( '✘ CSS preprocess files failed to build!' );} )
  .then(function() {
    if( program.less ) {
      buildCoreCssPreprocess( 'less' );
    } else if ( program.scss ) {
      buildCoreCssPreprocess( 'scss' );
    }
    return Q.delay( 2000 );
  }, function() { console.log( '✘ Core preprocess file failed to download!' );} )
  .then(function() {
    var pkg = new GetFile( 'package.json' );
    return Q.delay( 2000 );
  }, function() { console.log( chalk.red.bold( '✘ package.json failed to download!') );} )
  .then(function() {
    var bower = new GetFile( 'bower.json' );
    return Q.delay( 2000 );
  }, function() { console.log( chalk.red.bold( '✘ bower.json failed to download!') );})
  .then(function() {
    var bowerrc = new GetFile( '.bowerrc' );
    return Q.delay( 2000 );
  }, function() { console.log( chalk.red.bold( '✘ .bowerrc failed to download!') );})
  .then(function() {
    var grunt = new GetFile( 'Gruntfile.js' );
    return Q.delay( 2000 );
  }, function() { console.log( chalk.red.bold( '✘ Gruntfile.js failed to download!') );})
  .then(function() {
    var gulp = new GetFile( 'gulpfile.js' );
    return Q.delay( 2000 );
  }, function() { console.log( chalk.red.bold( '✘ gulpfile.js failed to download!') );})
  .done( doneMessage );
}) // end "app" command


// options
program
  .version( '0.0.1' )
  .option( '-b, --build', 'add "build" folder with subfolders' )
  .option( '-g, --gitignore', 'add ".gitignore" file' )
  .option( '-l, --less', 'create LESS files in "css-build"' )
  .option( '-s, --scss', 'create Sass files in "css-build"' )
  .option( '-t, --test', 'do a test scaffold in "init-test"' );


program.parse( process.argv );


// If no arguments or commands are passed, display "help"
if ( !program.args.length ) program.help();
