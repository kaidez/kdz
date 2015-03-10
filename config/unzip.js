"use strict"; // use ES5 strict mode



// Bring in Node modules
var Q = require( 'q' ), // Use Q to manage Promises
    program = require( 'commander' ), // Fires off commands and options
    Decompress = require( 'decompress' ); // Unzip files



// Unzip preprocessor zip files
function unzip() {

  var whatType;  // Variable that will grab a reference to the .zip file
  if( program.less ) { // if "less" flag is passed
    whatType = "less.zip";
  } else { // if "sass" flag is passed
    whatType = "sass.zip";
  }

  // Use "decompress" module to unzip file in "css-build/imports"
  var decompress = new Decompress( {mode: '755'} )
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

module.exports = unzip;
