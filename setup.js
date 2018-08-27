const colors = require('colors');
const fs = require('fs');

// START SUB: Initial Prompt and Console
// COMMENT: You must adhere to the comment policy in order for the documentation function to work.
// COMMENT: It's a pain in the ass but it works.
/* START */

module.exports = {
	
	setupConfig: function setupConfig(query, status) {
		if (fs.existsSync('config.json')) {
				status(console.log('Welcome back!'));
		} else {
				fs.readFile('example.config.json', 'utf8', function (err,data) {
						if (err) {
								return console.log(err);
						}
						fs.writeFile('config.json', data, 'utf8', function (err) {
								if (err) return console.log(err);
								status(console.log('Config generation done!'.bold.green));
						});
				});	
		}
	}
}
/* END */
// END SUB: Initial Prompt and Console
