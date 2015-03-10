/*
 * "goToTest()"
 * =====================================================================
 *
 * If "test" flag is passed, check if "test-build/" folder exists
 * If "test-build/" exists, create it then "cd" into it
 * If "test-build/" does not exist, "cd" into it
 * Returns a promise
 */

var fs = require( 'fs' ),
    Q = require( 'q' ), // Use Q to manage Promises
    program = require( 'commander' ), // Fires off commands and options
    mkdirp = require( 'mkdirp' ), // Recursively make directories
    chalk = require( 'chalk' ); // Colorize console messages

function goToTest() {

  if ( program.test ) {
    fs.open( 'test-build', 'rs', function( err, fd ) {
      if ( err && err.code == 'ENOENT' ) {

        // If "test-build" DOES NOT exists, create it with "mkdirp"
        mkdirp( 'test-build' , function ( err ) {

          // Throw an error if it can't be created for whatever reason
          if ( err ) {
            console.error( err )
          } else {
            process.chdir( 'test-build' );
            console.log( chalk.cyan.underline( '>> Create "test-build" folder, do a test scaffold inside of it"...\n' ) );
          }
        });
      } else {
        console.log( chalk.cyan.underline( '>> Do a test scaffold in the already-existing "test-build" folder...\n' ) );
        process.chdir( 'test-build' );
        fs.close( fd );
      }
    });
  } else {
    return false;

  }
  return Q.delay( 3000 );
} // end "goToTest()"

module.exports = goToTest;
