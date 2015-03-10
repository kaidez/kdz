"use strict"; // use ES5 strict mode



// Bring in core and plugin-like Node modules
var fs = require( 'fs' ), // Read files with Node's fs module
    program = require( 'commander' ), // Fires off commands and options
    mkdirp = require( 'mkdirp' ), // Recursively make directories
    chalk = require( 'chalk' ); // Colorize console messages



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

module.exports = buildFolder;
