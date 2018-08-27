// START SECTION: INIT

// START SUB: Constants
/* START */
const colors = require('colors');
const fs = require('fs');
/* END */
// END SUB: Constants

// START SUB: Config Check/Setup Function
/* START */
if (fs.existsSync('./lib/config.json')) {
	console.log('Welcome back!');
	var config = require('./config.json');
	var { bot_nickname, bot_api_key, bot_web_port } = config;
	module.exports = {
		bot_nickname: bot_nickname,
		bot_api_key: bot_api_key,
		bot_web_port: bot_web_port
	}
} else {
	fs.readFile('./lib/example.config.json', 'utf8', function (err,data) {
		if (err) {
				return console.log(err);
		}
		fs.writeFile('./lib/config.json', data, 'utf8', function (err) {
			if (err) return console.log(err);
			console.log('You did not have a default config.json, so we created one for you. Re-run the command.'.rainbow);
			process.exit();
		});
	});	
}
/* END */
// END SUB: Config Check/Setup Function

// END SECTION: INIT
