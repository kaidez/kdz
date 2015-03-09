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



// Root URL for downloading files from GitHub
// Concatenate this to other variables create absolute file references
// Used in both "getAllFiles()" and "getSingleFile()" functions
var githubRoot = 'https://raw.githubusercontent.com/kaidez/kdz/master/source-';

// Stop "kdz app" tasks under certain conditions
// Passes error as under Node proccess exit code 9 ("Invalid Argument")
function flagCheck() {

  // Stop it if "build" & "wordpress" flags are passed at the same time
  if ( program.build && program.wordpress ) {
    console.log(chalk.red( '"build and "wordpress" flags cannot be passed at the same time\nExiting task....\n' ) );
    process.exit(9);
  }

  // Stop it if "less" & "sass" flags are passed at the same time
  if ( program.less && program.scss ) {
    console.log(chalk.red( '"less" and "scss" flags cannot be passed at the same time\nExiting task....\n' ) )
    process.exit(9);
  }

}



// If the "test" flag is passed, check the type of project
// Go to "test-spa" if it's "program.build"
// Go to "test-wordpress" if it's "program.wordpress"
function goToTest() {
  var deferred = Q.defer();
  if ( ( program.test && !program.wordpress ) || ( program.build && program.test ) ) {
    process.chdir( 'test-spa' );
    deferred.resolve();
  } else if( program.wordpress && program.test )  {
    process.chdir( 'test-wordpress' );
    deferred.resolve();
  } else {
    return false;
    deferred.resolve();
  }
  return deferred.promise;
} // end "goToTest()"



/*
 * "download()"
 * =====================================================================
 *
 * Used in both the "getAllFiles()" and "getSingle()" functions
 * "file" param represents the file to be downloaded
 * "folder" param defines which folder the file's in...
 *  ...which is either "source-spa" or "source-wordpress"
 *
 * "download()" performs the following steps:
 * 1. Builds GitHub repo link for the file that needs to be downloaded
 * 2. Checks to see if this file doesn't already exist
 * 3. Downloads the file if it DOES NOT exist
 * 4. Doesn't downloads the file if it DOES exist, then sends a message
 * 5. Stops the Node "fs" process
 */
function download( file, folder ) {

  // Build GitHub repo link
  var getFile  = githubRoot + folder + '/' + file;

  // Use Node "fs.open" to check if the file exists
  fs.open( file, 'rs', function( err, fd ) {
    if ( err && err.code == 'ENOENT' ) {

      // If the file DOES NOT exists, download it
      var download = new Download( { strip: 1 } )
      .get( getFile )
      .dest( '.' )
      .use( progress() );

      // Throw an error if the file can't be downloaded
      download.run( function ( err ) {
        if ( err ) {
          throw err;
        }
      });

    } else {

      // If the file DOES exists, don't download it
      // Pass a console message saying so and stop the fs process
      console.log( chalk.red( '"' +  file + '" exists...don\'t download it.\n' ) );
      fs.close( fd );
    }

  });

} // end "download()"



/*
 * "buildFolder()"
 * =====================================================================
 *
 * Reusable function that looks at given arrays to build folders
 * "array" param points to an array listed in "config/data.js"
 * "getDir" param points to which folder to check to see if it exists
 *
 * "buildFolder()" performs the following steps:
 * 1. Runs "forEach()"" against the array, with "folder" as its index
 * 2. Checks to see if folder defined by "getDir" doesn't already exist
 * 3. Builds the foler if it DOES NOT exist
 * 4. Doesn't build the folder if it DOES exist, then sends a message
 * 5. Stops the Node "fs" process
 */
function buildFolder( array, getDir ) {

  array.forEach( function( folder ) {

    // Use Node "fs.open" to folder defined by "getDir" exists
    fs.open( getDir, 'rs', function( err, fd ) {

      if ( err && err.code == 'ENOENT' ) {

        // If a folder DOES NOT exists, create it with "mkdirp"
        mkdirp( folder , function ( err ) {

          // Throw an error if it can't be created for whaterver reason
          if ( err ) console.error( err )

          // Pass a console message saying that it's been created
          else console.log( '"' + folder + '/" created!\n' )
        });
      } else {

        // If a folder DOES exists, don't download it
        // Pass a console message saying so and stop the fs process
        console.log( chalk.red( '"' +folder + '/" exists...don\'t create it.\n' ) );
        fs.close( fd );
      }

    });

  }); // end "array.forEach()"

} // end "buildFolder()"



/*
 * "getAllFiles()"
 * =====================================================================
 *
 * Uses the above "download()" method to download an array of files
 * "arrays" param points to an array listed in "config/data.js"
 * "folder" param points to which folder to download the files
 */
function getAllFiles( array, folder ) {

  // Loop through the array to find files
  // "coreFile" represents one item in an array
  array.forEach( function( coreFile ) {

    // Use "download()" to file-check & download the files in the array
    // Pass "array" & "folder" params above, "download()" does the rest
    download( coreFile, folder );

  })

} // end "getAllFiles()"



/*
 * "getSingleFile()"
 * =====================================================================
 *
 * Uses the above "download()" method to download a single file
 * "file" param points to a file listed in "config/data.js"
 * "folder" param points to which folder to download the files
 */
function getSingleFile( file, folder ) {

  // Use "download()" to file-check & download the single file
  // Pass "file" & "folder" params above, "download()" does the rest
  download( file, folder );

} // end "getSingleFile()"



// Step 1: go to the "coffee" directory
// Step 2: create "main.coffee" inside of "coffee"
// Step 3: go back up to the root folder
function touchCoffee() {

  fs.open( 'main.coffee', 'rs', function( err, fd ) {
    if ( err && err.code == 'ENOENT' ) {
      child = exec('touch main.coffee',
      function ( error ) {
        if (error !== null) {
          console.log( 'exec error: ' + error );a
        } else {
          // Pass a console message saying that it's been created
          console.log( '"coffee/main.coffee" created!\n' )
        }
      });
    } else {
      // If a folder DOES exists, don't download it
      // Pass a console message saying so and stop the fs process
      console.log( chalk.red( '"coffee/main.coffee" exists...don\'t create it.\n' ) );
      fs.close( fd );
    }
  })

} // end "touchCoffee()"



// Helper function for downloading CSS preprocessors files
// "whatType" is a preprocessor file type: either "less" or "scss"
// "ifFile" is a file to look for before downloading files...
// ...either "style.less" or "style.scss"
// Internally uses the above "getAllFiles()" function
// Downloads .zip files to be later unzipped with the "unzip()" function
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



// Unzip preprocessor zip files
function unzip() {

  var whatType;  // Variable that will grab a reference to the .zip file
  if( program.less ) { // if "less" flag is passed
    whatType = "less.zip";
  } else { // if "sass" flag is passed
    whatType = "sass.zip";
  }

  // Use "decompress" module to unzip file in "css-build/imports"
  var decompress = new Decompress({mode: '755'})
    .src( whatType )
    .dest( 'css-build/imports' )
    .use( Decompress.zip( {strip: 1} ) );

  // Throw an error if "decompress" can't unzip the file
  decompress.run(function ( err ) {
    if ( err ) {
      throw err;
    }

  });

  return Q.delay( 1500 ); // Return a Promise
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
    Q.fcall( goToTest )
    .then(function() {
      console.log( chalk.green.underline( '>> Create preprocess folders...\n' ) );
      return Q.delay( 1500 );
    })
    .then(function() {
      buildFolder( data.source_build, "css-build" );
      return Q.delay( 1500 );
    }, function() { console.log( '✘ preprocess folders failed to be created!' );} )
    .then(function() {
      if( program.wordpress ) {
        return false;
      } else {
        console.log( chalk.green.underline( '>> Create build folders...\n' ) );
        buildFolder( data.build_folder, "build" );
      }
      return Q.delay( 1500 );
    }, function() { console.log( '✘ build folders failed to be created!' );} )
    .then(function(){
      console.log( chalk.green.underline( '>> Create "coffee/main.coffee"...\n' ) );
      return Q.delay( 500 );
    })
    .then(function(){
      process.chdir( 'coffee' );
      return Q.delay( 1000 );
    })
    .then(function(){
      touchCoffee();
      return Q.delay( 1000 );
    })
    .then(function(){
      process.chdir( '../' );
      return Q.delay( 1000 );
    })
    .then(function() {
      if( program.wordpress ) {
        Q.delay(1500).then(console.log( chalk.green.underline( '>> Download "functions.php"...\n' ) ) )
        .then(function(){
          getSingleFile( data.wp_files[1], "wordpress" );
        })
      }
      return Q.delay( 1500 );
    }, function() { console.log( '✘ "functions.php" failed to download!' );} )
    .then(function(){
      console.log( chalk.green.underline( '>> Download common project files"...\n' ) );
      return Q.delay( 1500 );
    })
    .then(function(){
      getAllFiles( data.shared, "shared-files" );
      return Q.delay( 1500 );
    }, function() { console.log( '✘ Common project files failed to download!' );} )
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
    }, function() { console.log( '✘ Core files failed to download!' );} )
    .then(function() {
      if ( program.gitignore && program.wordpress && !program.build ) {
        getSingleFile( data.wp_files[0], "wordpress" );
      } else if (( program.gitignore && program.build ) || ( program.gitignore && !program.wordpress && !program.build )) {
        getSingleFile( data.spa_files, "spa" );
      }
      return Q.delay( 1500 );
    })
    .then(function(){
      if( program.less || program.scss ) {
        console.log( chalk.green.underline( '>> Download CSS preprocessor project files"...\n' ) );
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
