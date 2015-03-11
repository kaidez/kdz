#!/usr/bin/env node
// Run this task with Node



"use strict"; // use ES5 strict mode



// Bring in core and plugin-like Node modules
var fs = require( 'fs' ), // Read files with Node's fs module
    exec = require( 'child_process' ).exec, // execute line commands
    chalk = require( 'chalk' ); // Colorize console messages



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
 * "arrays" param points to an array listed in "config/data.js"
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
 * "touchCoffee()"
 * =====================================================================
 *
 * Step 1: Check to see if "main.coffee" exists
 * Step 2: Create it if it does
 * Step 3: Don't create it if it doesn't and pass a message saying so
 * Step 4: Stop the fs process
*/
function touchCoffee() {

  fs.open( 'main.coffee', 'rs', function( err, fd ) {
    if ( err && err.code == 'ENOENT' ) {
      exec('touch main.coffee',
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

module.exports = touchCoffee;
