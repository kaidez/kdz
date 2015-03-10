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
  var deferred = Q.defer();
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
            console.log( chalk.cyan.underline( '>> Do test scaffold in "test-build/"...\n' ) );
          }
        });
      } else {
        console.log( chalk.cyan.underline( '>> Do test scaffold in the already-existing "test-build/"...\n' ) );
        process.chdir( 'test-build' );
        fs.close( fd );
      }
    });
    deferred.resolve();
  } else {
    return false;
    deferred.resolve();
  }
  return deferred.promise;
  return this;
} // end "goToTest()"

module.exports = goToTest;
