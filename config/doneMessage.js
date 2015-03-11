"use strict"; // use ES5 strict mode



// Bring in core and plugin-like Node modules
var chalk = require( 'chalk' ); // Colorize console messages




// Output a console message after "app" is done
function doneMessage() {
  console.log( chalk.yellow.bold.underline( 'THE PROJECT IS SCAFFOLDED!!') );
  console.log( chalk.yellow( 'Next steps...\n') );
  console.log( chalk.yellow( 'You will need to fill in fields in \"package.json\" and \"bower.json\"\n') );
  console.log( chalk.yellow( 'Run \"npm-check-updates\" to check for project modules updates\n') );
  console.log( chalk.yellow( 'Run \"bower list\" to check for front-end dependency updates\n') );
  console.log( chalk.yellow( 'Run \"npm install\" and \"bower install\" after that\n') );
} // end "doneMessage()"

module.exports = doneMessage;
