// START SECTION: INIT

// START SUB: Constants
/* START */
const colors = require('colors');
const fs = require('fs');
const initPath = __dirname.replace(/lib/g, '');
/* END */
// END SUB: Constants

// START SUB: Config Check/Setup Function
/* START */
if (fs.existsSync(initPath+'/config/config.json')) {
	console.log('Welcome back!');
	var config = require(initPath+'/config/config.json');
	var { bot_nickname, bot_api_key, bot_web_port, bot_shell_whitelist } = config;
	module.exports = {
		bot_nickname: bot_nickname,
		bot_api_key: bot_api_key,
		bot_web_port: bot_web_port,
		bot_shell_whitelist: bot_shell_whitelist
	}
} else {
	fs.readFile(initPath+'/config/example.config.json', 'utf8', function (err,data) {
		if (err) {
				return console.log(err);
		}
		fs.writeFile(initPath+'/config/config.json', data, 'utf8', function (err) {
			if (err) return console.log(err);
			console.log('You did not have a default config.json, so we created one for you. Re-run the command.'.rainbow);
			process.exit();
		});
	});	
}
/* END */
// END SUB: Config Check/Setup Function

// END SECTION: INIT
