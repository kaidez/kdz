#!/usr/bin/env node
// Run this task with Node

"use strict"; // use ES5 strict mode



// Bring in Node modules
var fs = require( 'fs' ),
    exec = require( 'child_process' ).exec,
    program = require( 'commander' ),
    mkdirp = require( 'mkdirp' ),
    Q = require( 'q' ),
    chalk = require( 'chalk' ),
    Download = require( 'download' ),
    progress = require( 'download-status' ),
    Decompress = require( 'decompress' ),
    data = require( './config/data.js' ),
    child;



// Exit tasks under certain conditions
// Passes error as under Node proccess exit code 9 ("Invalid Argument")
function flagCheck() {

  // Exit if "build" & "wordpress" flags are passed at the same time
  if ( program.build && program.wordpress ) {
    console.log(chalk.red( '"build and "wordpress" flags cannot be passed at the same time\nExiting task....\n' ) );
    process.exit(9);
  }

  // Exit if "less" & "sass" flags are passed at the same time
  if ( program.less && program.scss ) {
    console.log(chalk.red( '"less" and "scss" flags cannot be passed at the same time\nExiting task....\n' ) )
    process.exit(9);
  }

}



// If the "test" flag is passed, check the type of project
// Go to "test-spa" if it's "program.build"
// Go to "test-wordpress" if it's "program.wordpress"
function goToTest() {

  if( program.build && program.test ) {
    process.chdir( 'test-spa' );
  } else if( program.wordpress && program.test )  {
    process.chdir( 'test-wordpress' );
  } else {
    return false;
  }

} // end "goToTest()"



/*
 * "getAllFiles()" function
 * =====================================================================
 *
 * Download files based on arrays in "config/data.js"
 * Download them to folders defined by the "folder" parameter
 * "folder" is defined by concatenating this param in "var fileDownload"
 * THIS WILL NEED TO BE REFACTORED!!!!!!!!!!
 */
function getAllFiles( array, folder ) {

  // Root URL for downloading files from GitHub
  var fileDownload = 'https://raw.githubusercontent.com/kaidez/kdz/master/source-' + folder + '/';

  // Loop through the given array to find files
  array.forEach( function( coreFile ) {

    // Concatenate a file name to reference a file on my GitHub Repo
    var file  = fileDownload + coreFile;

    // Use Node "fs.open" to check if the file exists before downloading
    fs.open( coreFile, 'rs', function( err, fd ) {
      if ( err && err.code == 'ENOENT' ) {

        // If the file DOES NOT exists, download it
        var download = new Download( { strip: 1 } )
        .get( file )
        .dest( '.' )
        .use( progress() );

        // Throw an error if the file can't be downloaded
        download.run( function ( err ) {
          if ( err ) {
            throw err;
          }
        });

      } else {

        // If the file DOES exists, pass a console message saying so
        // Stop the fs process
        console.log( chalk.red( coreFile + ' exists...don\'t download it.\n' ) );
        fs.close( fd );
      }

    });

    return Q.delay( 2000 ); // Return a Promise
  })

} // end "getAllFiles()"



/*
 * "getSingleFile()" function
 * =====================================================================
 *
 * Roughly the same as "getAllFiles()" but grabs only one file
 * THIS WILL NEED TO BE REFACTORED!!!!!!!!!!
 */
function getSingleFile( file, folder ) {

  // Root URL for downloading files from GitHub
  var fileDownload = 'https://raw.githubusercontent.com/kaidez/kdz/master/source-' + folder + '/';

  // Concatenate a file name to reference a file on my GitHub Repo
  var singleFile  = fileDownload + file;

  // Use Node "fs.open" to check if the file exists before downloading
  fs.open( file, 'rs', function( err, fd ) {
    if ( err && err.code == 'ENOENT' ) {

      // If the file DOES NOT exists, download it
      var download = new Download( { strip: 1 } )
      .get( singleFile )
      .dest( '.' )
      .use( progress() );

      // Throw an error if the file can't be downloaded
      download.run( function ( err ) {
        if ( err ) {
          throw err;
        }
      });

    } else {

      // If the file DOES exists, pass a console message saying so
      // Stop the fs process
      console.log( chalk.red( file + ' exists...don\'t download it.\n' ) );
      fs.close( fd );
    }

  });

  return Q.delay( 2000 ); // Return a Promise

} // end "getSingleFile()"



// Create core project directories when "kdz app" is run
function buildFolders() {

  console.log( chalk.green.underline( '>> Creating project directories...\n' ) );
  ['css-build/imports', 'coffee', 'image-min'].forEach( function( element ) {
    mkdirp( element , function ( err ) {
      if ( err ) console.error( err )
      else console.log( '"' + element + '/" created!\n' )
    });
  });

} // end "buildFolders()"



// If the "build" flag is passed, create a "build/" folder
// Place "css/" & "js/" subdirectories inside of it.
function buildDir()  {

  // Use Node fs.open to check if the folder exists before making it
  fs.open( 'build', 'rs', function( err, fd ) {
    console.log( chalk.green.underline( '>> Creating \"build\" folder & sub-directories...\n' ) );
    if ( err && err.code == 'ENOENT' ) {

      // If "build/" does NOT exist, create it & its subdirectories
      // Use 'forEach()' to create them
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

  return Q.delay( 2000 );
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

  return Q.delay( 2000 ); // Return a Promise
} // end "buildCoffee()"



// Helper function for downloading CSS preprocessors files
// "whatType" is a preprocessor file type: either "less" or "scss"
// "ifFile" is a file to look for before downloading files...
// ...either "style.less" or "style.scss"
// Internally uses the above "getAllFiles()" function
// Downloads .zip files, which are unzipped with the "unzip()" function
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

      } else if ( program.build ) {
        getAllFiles( whatType, "spa" );
      }
    } else {

      // If "style" file DOES exist, don't download files
      // Pass a console message saying it exists & stop the fs process
      console.log( chalk.red( '"CSS preprocessor files may exists...don\'t create new ones.\n' ) );
      fs.close( fd );
    }

  });

  return Q.delay( 2000 ); // Return a Promise
} // end "preProcess()"



// Unzip preprocessor zip files to "css-build/imports"
function unzip() {

  var whatType;
  if( program.less ) { // if "less" flag is passed
    whatType = "less.zip";
  } else { // if "sass" flag is passed
    whatType = "sass.zip";
  }

  var decompress = new Decompress({mode: '755'})
    .src( whatType )
    .dest( 'css-build/imports' )
    .use( Decompress.zip( {strip: 1} ) );

  decompress.run(function ( err ) {
    if ( err ) {
      throw err;
    }

  });

  return Q.delay( 2000 ); // Return a Promise
} // end "unzip()"



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
      return Q.delay( 2000 );
    }, function() { console.log( '✘ "build/" directory failed to be created!' );} )
    .then(function() {
      if( program.wordpress ) {
        getSingleFile( data.wp_files[1], "wordpress" );
      }
      return Q.delay( 2000 );
    }, function() { console.log( '✘ "functions.php" failed to download!' );} )
    .then(function(){
      console.log( chalk.green.underline( '>> Download common project files"...\n' ) );
      return Q.delay( 2000 );
    }, function() { console.log( '✘ Common project files failed to down!' );})
    .then(function(){
      getAllFiles( data.shared, "shared-files" );
      return Q.delay( 2000 );
    }, function() { console.log( '✘ Core project files failed to download!' );} )
    .then(function(){
      console.log( chalk.green.underline( '>> Download task runner project files & package.json...\n' ) );
      return Q.delay( 2000 );
    })
    .then(function() {
      if( program.wordpress ) {
        getAllFiles( data.core, "wordpress" );
      } else if( program.build ) {
        getAllFiles( data.core, "spa" );
      } else {
        return false;
      }
      return Q.delay( 2000 );
    }, function() { console.log( '✘ Core files failed to download!' );} )
    .then(function(){
      if ( program.gitignore && program.wordpress ) {
        getSingleFile( data.wp_files[0], "wordpress" );
      } else if ( program.gitignore && program.build ) {
        getSingleFile( data.spa_files, "spa" );
      }
      return Q.delay( 2000 );
    })
    .then(function(){
      console.log( chalk.green.underline( '>> Download CSS preprocessor project files"...\n' ) );
      return Q.delay( 2000 );
    })
    .then(function() {
      if( program.less ) {
        preProcess( data.less, "style.less" )
      } else if( program.scss ) {
        preProcess( data.sass, "style.scss" )
      } else {
        return false;
      }
      return Q.delay( 2000 );
    }, function() { console.log( '✘ Preprocessor files failed to download!' );} )
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
        exec(zip);
        exec(file);
      })
    })
    .done( doneMessage );
  }) // end "app" command



// options
program
  .version( '0.0.1' )
  .option( '-b, --build', 'create a SPA-like project' )
  .option( '-w, --wordpress', 'create a WordPress project' )
  .option( '-g, --gitignore', 'download ".gitignore" file' )
  .option( '-l, --less', 'download LESS files in "css-build"' )
  .option( '-s, --scss', 'download Sass files in "css-build"' )
  .option( '-t, --test', 'do a test scaffold' );



// Pass options to commands
program.parse( process.argv );



// If no arguments or commands are passed, display "help"
if ( !program.args.length ) program.help();
