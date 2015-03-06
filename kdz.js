#!/usr/bin/env node
// Run this task with Node

"use strict"; // use ES5 when possible



// Bring in Node modules
var fs = require( 'fs' ),
    exec = require( 'child_process' ).exec,
    program = require( 'commander' ),
    mkdirp = require( 'mkdirp' ),
    Q = require( 'q' ),
    chalk = require( 'chalk' ),
    Download = require( 'download' ),
    progress = require( 'download-status' ),
    data = require('./config/data.js'),
    child;



// Exit task if "build" & "wordpress" flags are passed at the same time
// Pass the error as "Invalid Argument"
function flagCheck(){
  var error = new Error('"build and "wordpress" flags cannot be passed at the same time\nExiting task....\n');
  if ( program.build && program.wordpress ) {
    console.log(chalk.red( error ) );
    process.exit(9);
  }
}



// If the "test" flag is passed, check the type of project
// Go to "init-test" if it's "program.build"
// Go to "wp-test" if it's "program.wordpress"
function goToTest() {
  if( program.build && program.test ) {
    process.chdir( 'init-test' );
  } else if( program.wordpress && program.test )  {
    process.chdir( 'wp-test' );
  } else {
    return false;
  }
} // end "goToTest()"



/*
* "getFile()" function
* =====================================================================
*
*/
function getFile( array, folder ) {

  // Root URL for downloading files from GitHub
  var fileDownload = 'https://raw.githubusercontent.com/kaidez/kdz/master/source-' + folder + '/';

  array.forEach( function( coreFile ) {
    var file  = fileDownload + coreFile;

    // Use Node "fs.open" to check if the file exists before downloading
    fs.open( coreFile, 'rs', function( err, fd ) {
      if ( err && err.code == 'ENOENT' ) {

        // If the file DOES NOT exists, download it
        var download = new Download( { strip: 1 } )
        .get( file )
        .dest( '.' )
        .use( progress() );

        download.run( function ( err ) {
          if ( err ) {
            throw err;
          }
        });

      } else {
      // If the file DOES NOT exists, download it
        console.log( chalk.red( coreFile + ' exists...don\'t download it.\n' ) );
        fs.close( fd );
      }

    });
    return Q.delay( 3000 );
  })


} // end "getFile()"



// Create core project directories when "kdz app" is run
function buildFolders() {
  console.log( chalk.green.underline( '>> Creating project directories...\n' ) );
  ['css-build/imports', 'coffee', 'image-min'].forEach( function( element ) {
    mkdirp( element , function ( err ) {
      if ( err ) console.error( err )
      else console.log( '"' + element + '/" created!\n' )
    });
  });

} // end 'buildFolders()'



// If the "build" flag is passed, create a "build/" folder
// Place "css/" & "js/" subdirectories inside of it.
function buildDir()  {

  // Use Node fs.open to check if the folder exists before making it
  fs.open( 'build', 'rs', function( err, fd ) {
    console.log( chalk.green.underline( '>> Creating \"build\" folder & sub-directories...\n' ) );
    if ( err && err.code == 'ENOENT' ) {

      // If "build/" does NOT exist, create it & its subdirectories
      ['build/css', 'build/js', 'build/js/libs'].forEach( function( element ) {
        mkdirp( element , function ( err ) {
          if ( err ) console.error( err )
          else console.log( '"' + element + '" created!\n' )
        });
      });

    } else {

      // If "build" DOES exist, don't create it
      // Pass a console message saying it exists & stop the fs process
      console.log( chalk.red( '"build/" already exists...don\'t create a new one.\n' ) );
      fs.close( fd );
    }
  });
  return Q.delay( 3000 );
} // end "buildDir()"



// Step 1: go to the "coffee" directory
// Step 2: create "main.coffee" inside of "coffee"
// Step 3: go back up to the root folder
function buildCoffee() {
  console.log( chalk.green.underline( '>> Creating "coffee/main.coffee"...\n' ) );
  process.chdir( 'coffee' );

  child = exec('touch main.coffee',
  function ( error ) {
    if (error !== null) {
      console.log( 'exec error: ' + error );
    }
  });

  process.chdir( '../' );
  return Q.delay( 3000 );
} // end "buildCoffee()"



// Helper function for creating CSS preprocessors files
// "whatType" will be a preprocessor file type: either "less" or "scss"
// Internally uses the above "getFile()" function
function preProcess( whatType ) {

  if( program.wordpress ) {
    getFile( whatType, "wordpress" );

  } else if ( program.build ) {
    getFile( whatType, "spa" );
  }

} // end "preProcess()"



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
    flagCheck(); // does not return a promise
    goToTest(); // does not return a promise
    buildFolders(); // does not return a promise
    buildCoffee() // returns a promise
    .then(function() {
      if( program.build ) {
        buildDir();
      }
      return Q.delay( 3000 );
    }, function() { console.log( '✘ "build/" directory failed to be created!' );} )
    .then(function(){
      console.log( chalk.green.underline( '>> Download common project files"...\n' ) );
      return Q.delay( 3000 );
    }, function() { console.log( '✘ Common project files failed to down!' );})
    .then(function(){
      getFile( data.shared, "shared-files" );
      return Q.delay( 3000 );
    }, function() { console.log( '✘ Core project files failed to download!' );} )
    .then(function(){
      console.log( chalk.green.underline( '>> Download task runner project files & package.json...\n' ) );
      return Q.delay( 3000 );
    }, function() { console.log( '✘ Task runner project and.or files failed to download!' );})
    .then(function() {
      if( program.wordpress ) {
        getFile( data.core, "wordpress" );
      } else if( program.build ) {
        getFile( data.core, "spa" );
      } else {
        return false;
      }
      return Q.delay( 3000 );
    }, function() { console.log( '✘ Core files failed to download!' );} )
    .then(function(){
      console.log( chalk.green.underline( '>> Download CSS preprocessor project files"...\n' ) );
      return Q.delay( 3000 );
    }, function() { console.log( '✘ Task runner project and.or files failed to download!' );})
    .then(function() {
      if( program.less ) {
        preProcess( data.less )
      } else if( program.scss  ) {
        preProcess( data.sass )
      } else {
        return false;
      }
      return Q.delay( 3000 );
    }, function() { console.log( '✘ Preprocessor files failed to download!' );} )
    .done( doneMessage );
  }) // end "app" command



// options
program
  .version( '0.0.1' )
  .option( '-b, --build', 'create a SPA-link project' )
  .option( '-w, --wordpress', 'create a WordPress project' )
  .option( '-g, --gitignore', 'download ".gitignore" file' )
  .option( '-l, --less', 'download LESS files in "css-build"' )
  .option( '-s, --scss', 'download Sass files in "css-build"' )
  .option( '-t, --test', 'do a test scaffold' );



program.parse( process.argv );



// If no arguments or commands are passed, display "help"
if ( !program.args.length ) program.help();
