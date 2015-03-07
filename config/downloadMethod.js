/*
 * "download()" function
 * =====================================================================
 *
 * Used in both the "getAllFiles()" and "getSingle()" functions
 * "file" parameter represents the file to be downloaded
 * "folder" parameter defines which folder the file's in...
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

  var getFile  = githubRoot + folder + '/' + file;

  // Use Node "fs.open" to check if the file exists before downloading
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
      console.log( chalk.red( file + ' exists...don\'t download it.\n' ) );
      fs.close( fd );
    }

  });
} // end "download()"

module.exports = downloadMethod;
