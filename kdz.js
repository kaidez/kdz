#!/usr/bin/env node
// Run this task with Node



"use strict"; // use ES5 strict mode



// Bring in core and plugin-like Node modules
var fs = require( 'fs' ), // Read files with Node's fs module
    exec = require( 'child_process' ).exec, // execute line commands
    program = require( 'commander' ), // Fires off commands and options
    Q = require( 'q' ), // Use Q to manage Promises
    Decompress = require('decompress'),
    chalk = require( 'chalk' ); // Colorize console messages

// Bring in Node modules that kaidez created
var data = require( './config/data.js' ), // JSON file data is visible
    dlFiles = require( './config/dlFiles.js' ), // Download GitHub files
    buildFolder = require( './config/buildFolder.js' ), // Build folders
    unzip = require( './config/unzip.js' ), // Unzip files
    goToTest = require( './config/goToTest.js' ), // Run a test build
    touchCoffee = require( './config/touchCoffee.js' ), // "main.coffee"
    doneMsg = require( './config/doneMessage.js' ); // ".done()" message

// Stop "kdz app" if "less" & "sass" flags are passed at the same time
// Passes error as under Node proccess exit code 9 ("Invalid Argument")
function flagCheck() {

  if ( program.less && program.scss ) {
    console.log(chalk.red( 'Invalid Argument: "less" and "scss" flags cannot be passed at the same time\nExiting task....\n' ) )
    process.exit( 9 );
  }

} // end "flagCheck()"



/*
 * "getAllFiles()"
 * =====================================================================
 *
 * Uses the above "dlFiles()" method to download an array of files
 * "array" param points to an array listed in "config/data.js"
 * "folder" param points to which folder to download the files
 */
function getAllFiles( array, folder ) {

  // Loop through the array to find files
  // "coreFile" represents one item in an array
  array.forEach( function( coreFile ) {

    // Use "dlFiles()" to file-check & download the files in the array
    // Pass "array" & "folder" params above, "dlFiles()" does the rest
    dlFiles( coreFile, folder );

  })

} // end "getAllFiles()"



/*
 * "getSingleFile()"
 * =====================================================================
 *
 * Uses the above "dlFiles()" method to download a single file
 * "file" param points to a file listed in "config/data.js"
 * "folder" param points to which folder to download the files
 */
function getSingleFile( file, folder ) {

  // Use "dlFiles()" to file-check & download the single file
  // Pass "file" & "folder" params above, "dlFiles()" does the rest
  dlFiles( file, folder );

} // end "getSingleFile()"



/*
 * "preProcess()"
 * =====================================================================
 *
 * Helper function for downloading CSS preprocessors files
 * "whatType" is a preprocessor file type: either "less" or "scss"
 * Don't create it if it doesn't and pass a message saying so
 * Stop the fs process folder
 * "ifFile" is a file to look for before downloading files...
 * ...either "style.less" or "style.scss"
 * Internally uses the above "getAllFiles()" function
 * Downloads .zip files to be later unzipped with the "unzip()" function
 */
function preProcess( whatType, ifFile ) {

  // Create a reference for a file to look for before downloading files
  // Look in the "css-build/" folder
  var coreFile = "css-build/" + ifFile;

  // Use Node fs.open to check if "style" file exists in "css-build/"
  fs.open( coreFile, 'rs', function( err, fd ) {
    if ( err && err.code == 'ENOENT' ) {

      // If "style" file DOES NOT exist, download the files
      // When "wordpress" flag is passed, download WordPress-type files
      // When "build" flag is passed, download SPA-type files
      if( program.wordpress ) {
        getAllFiles( whatType, "wordpress" );

      } else {
        getAllFiles( whatType, "spa" );
      }
    } else {

      // If "style" file DOES exist, don't download files
      // Pass a console message saying it exists & stop the fs process
      console.log( chalk.red( '"CSS preprocessor files may exists...new ones won\'t be created.\n' ) );
      fs.close( fd );
    }

  });

  return Q.delay( 1500 ); // Return a Promise
} // end "preProcess()"



// "app" command: scaffolds out a SPA-like project
program
  .command( 'app' )
  .description( 'scaffold a basic web application' )
  .action(function() {
    flagCheck(); // does not return a promise
    Q.fcall(goToTest)
    .then(function() {
      console.log( chalk.green.underline( '>> Create preprocess folders...\n' ) );
      return Q.delay( 1500 );
    })
    .then(function() {
      buildFolder( data.source_build, "css-build" );
      return Q.delay( 1500 );
    }, function() { console.log( chalk.red( '✘ preprocess folders failed to be created!' )  );} )
    .then(function() {
      if( program.wordpress ) {
        return false;
      } else {
        console.log( chalk.green.underline( '>> Create build folders...\n' ) );
        buildFolder( data.build_folder, "build" );
      }
      return Q.delay( 1500 );
    }, function() { console.log( chalk.red( '✘ build folders failed to be created!' ) ) ;} )
    .then(function(){
      console.log( chalk.green.underline( '>> Create "coffee/main.coffee"...\n' ) );
      return Q.delay( 500 );
    })
    .then(function(){
      process.chdir( 'coffee' );
      return Q.delay( 1500 );
    })
    .then(function(){
      touchCoffee();
      return Q.delay( 1500 );
    }, function() { console.log( chalk.red( '✘ "coffee/main.coffee" failed to be created!' ) ) ;})
    .then(function(){
      process.chdir( '../' );
      return Q.delay( 1500 );
    })
    .then(function(){
      if ( program.wordpress ){
        console.log( chalk.green.underline( '>> Download "functions.php & "wp-comment-block.css"...\n' ) );
      }  else {
         return false;
      }
      return Q.delay( 1500 );
    })
    .then(function() {
      if( program.wordpress ) {
        var coreWpArray = data.wp_files.slice(-2);
        getAllFiles( coreWpArray, "wordpress" );
      }
      return Q.delay( 1500 );
    }, function() { console.log( chalk.red( '✘ Either "functions.php" or "wp-comment-block.css" failed to download!' ) );} )
    .then(function(){
      console.log( chalk.green.underline( '>> Download common project files...\n' ) );
      return Q.delay( 1500 );
    })
    .then(function(){
      getAllFiles( data.shared, "shared-files" );
      return Q.delay( 1500 );
    }, function() { console.log( chalk.red( '✘ Common project files failed to download!' ) );} )
    .then(function(){
      console.log( chalk.green.underline( '>> Download task runner project files & package.json...\n' ) );
      return Q.delay( 1500 );
    })
    .then(function() {
      if( program.wordpress ) {
        getAllFiles( data.core, "wordpress" );
      } else {
        getAllFiles( data.core, "spa" );
      }
      return Q.delay( 1500 );
    }, function() { console.log( chalk.red( '✘ Task runner project files & package.jsons failed to download!' ) );} )
    .then(function(){
      if( program.gitignore ) {
        console.log( chalk.green.underline( '>> Download ".gitignore"...\n' ) );
        return Q.delay( 1500 );
      }
    })
    .then(function() {
      if ( program.gitignore && program.wordpress ) {
        getSingleFile( data.wp_files[0], "wordpress" );
      } else if (( program.gitignore ) || ( program.gitignore && !program.wordpress)) {
        getSingleFile( data.spa_files, "spa" );
      }
      return Q.delay( 1500 );
    }, function() { console.log( chalk.red( '✘ .gitignore failed to download!' ) );} )
    .then(function(){
      if( program.less || program.scss ) {
        console.log( chalk.green.underline( '>> Download CSS preprocessor project files...\n' ) );
        return Q.delay( 1500 );
      }
    })
    .then(function() {
      if( program.less ) {
        preProcess( data.less, "style.less" )
      } else if( program.scss ) {
        preProcess( data.sass, "style.scss" )
      } else {
        return false;
      }
      return Q.delay( 1500 );
    }, function() { console.log( chalk.red( '✘ Preprocessor files failed to download!' ) );} )
    .then(function(){
      fs.open( 'wp-comment-block.css', 'rs', function( err, fd ) {
        if ( err && err.code == 'ENOENT' ) {
          return false;
        } else {
          console.log( chalk.cyan.green( '>> Move "wp-comment-block.css" to "css-build/...\n' ) );
          exec( "mv wp-comment-block.css css-build/" );
        }
      });
    })
    .then(function() {
      return unzip()
      .then(function(){
        var zip, file;
        if ( program.less ) {
          zip = "rm -rf less.zip";
          file = "mv style.less css-build/";
        } else if ( program.scss ) {
          zip = "rm -rf sass.zip";
          file = "mv style.scss css-build/";
        }
        exec( zip );
        exec( file );
      }, function() { console.log( chalk.red( '✘ Preprocess files failed to copy over!' ) );})
    }, function() { console.log( chalk.red( '✘ Preprocess files failed unzip!' ) );})
    .done( doneMsg );
  }) // end "app" command



// delete "test-build" folder
program
  .command( 'dt' )
  .description( 'delete "test-build" folder' )
  .action(function() {
    fs.open( 'test-build', 'rs', function( err, fd ) {
      if ( err && err.code == 'ENOENT' ) {
        console.log( chalk.cyan.underline( '>> "test-build" doesn\'t exist...nothing to delete\n' ) );
      } else {
        exec( "rm -rf test-build/" );
      }
    });
  })



// options
program
  .version( '0.0.1' )
  .option( '-w, --wordpress', 'create a WordPress project' )
  .option( '-g, --gitignore', 'download ".gitignore" file' )
  .option( '-l, --less', 'download LESS files in "css-build"' )
  .option( '-s, --scss', 'download Sass files in "css-build"' )
  .option( '-t, --test', 'do a test scaffold in "test-build"' );



// Pass options to commands
program.parse( process.argv );



// If no arguments or commands are passed, display "help"
if ( !program.args.length ) program.help();
