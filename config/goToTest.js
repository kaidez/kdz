/*
 * "goToTest()"
 * =====================================================================
 *
 * If "test" flag is passed, check if "test-build/" folder exists
 * If "test-build/" exists, don't create...just "cd" into it
 * If "test-build/" does not exist, create it and then "cd" into it
 * Return a delayed promise
 */

var fs = require( 'fs' ), // Read files with Node's fs module
    Q = require( 'q' ), // Use Q to manage Promises
    program = require( 'commander' ), // Fires off commands and options
    mkdirp = require( 'mkdirp' ), // Recursively make directories
    chalk = require( 'chalk' ); // Colorize console messages

function goToTest() {

  // If the "--test" flag was passed, perform the steps below
  if ( program.test ) {

    // Use Node's "fs()" module to see if the "test-build" folder exists
    fs.open( 'test-build', 'rs', function( err, fd ) {

      // If "test-build" DOES NOT exists...
      if ( err && err.code == 'ENOENT' ) {

        // ...then create it with "mkdirp"
        mkdirp( 'test-build' , function ( err ) {

          // Throw error if "test-build" can't be created
          if ( err ) {
            console.error( err )
          } else {

            // If "test-build" was created," cd" into it & send message
            process.chdir( 'test-build' );
            console.log( chalk.cyan.underline( '>> Create "test-build" folder, do a test scaffold inside of it"...\n' ) );
          }
        });
      } else {

        // If "test-build" DOES exists, cd" into it & send a message
        // Close the "fs()" process afterwards
        console.log( chalk.cyan.underline( '>> Do a test scaffold in the already-existing "test-build" folder...\n' ) );
        process.chdir( 'test-build' );
        fs.close( fd );
      }
    });
  } else {

    // If the "--test" flag was NOT passed, then don't do anything
    return false;

  }
  return Q.delay( 1500 ); // Return a promise
} // end "goToTest()"

module.exports = goToTest;
