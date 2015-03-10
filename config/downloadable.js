

/*
 * "downloadable()"
 * =====================================================================
 *
 * Used in both the "getAllFiles()" and "getSingle()" functions
 * "file" param represents the file to be downloaded
 * "folder" param defines which folder the file's in...
 *  ...which is either "source-spa" or "source-wordpress"
 *
 * "downloadable()" performs the following steps:
 * 1. Builds GitHub repo link for the file that needs to be downloaded
 * 2. Checks to see if this file doesn't already exist
 * 3. Downloads the file if it DOES NOT exist
 * 4. Doesn't downloads the file if it DOES exist, then sends a message
 * 5. Stops the Node "fs" process
 */

 // Bring in Node modules
 var fs = require( 'fs' ), // Read files with Node's fs module
     chalk = require( 'chalk' ), // Colorize console messages
     Download = require( 'download' ), // Download files
     progress = require( 'download-status' );


function downloadable( file, folder ) {

  // Root URL for downloading files from GitHub
  // Concatenate this to other variables create absolute file references
  // Used in both "getAllFiles()" and "getSingleFile()" functions
  // Change this value if you want to download it from another repo
  var githubRoot = 'https://raw.githubusercontent.com/kaidez/kdz/master/source-';

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
} // end "downloadable()"
module.exports = downloadable;
