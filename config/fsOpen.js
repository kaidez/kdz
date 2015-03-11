
// Bring in core and plugin-like Node modules
var fs = require( 'fs' ), // Read files with Node's fs module
    exec = require( 'child_process' ).exec, // launch external processes
    program = require( 'commander' ), // Fires off commands and options
    Q = require( 'q' ), // Use Q to manage Promises
    chalk = require( 'chalk' ); // Colorize console messages

// Bring in Node modules that kaidez created
var data = require( './data.js' ), // JSON file data is visible
    dlFiles = require( './dlFiles.js' ), // Download GitHub files
    buildFolder = require( './buildFolder.js' ), // Build folders
    unzip = require( './unzip.js' ), // Unzip files
    goToTest = require( './goToTest.js' ); // Run a test build


function fsOpen( element, fn ) {

  this.element  = element;
  this.fn = fn;

	// Use Node fs.open to check if "style" element exists in "css-build/"
  	fs.open( this.element, 'rs', function( err, fd ) {
  		if ( err && err.code == 'ENOENT' ) {
  			return this.fn;
  		} else {
  			console.log ( "nope!" );
  			fs.close( fd );
  		}
  	});
    return this;
}

module.exports = fsOpen;
