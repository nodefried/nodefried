// START SECTION: CONFIGURATION

// START SUB: Constants
/* START */
const colors = require('colors');
const fs = require('fs');
//const { bot_nickname,bot_api_key,bot_web_port } = config;
/* END */
// END SUB: Constants

// START SUB: Config Check/Setup Function
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
// END SUB: Config Check/Setup Function

// END SECTION: CONFIGURATION
