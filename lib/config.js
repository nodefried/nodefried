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
	var { bot_nickname, bot_api_key, bot_port_web, bot_port_com, bot_shell_whitelist, discord_token_bot, discord_token_self } = config;
	module.exports = {
		bot_nickname: bot_nickname,
		bot_api_key: bot_api_key,
		bot_port_web: bot_port_web,
		bot_port_com: bot_port_com,
		bot_shell_whitelist: bot_shell_whitelist,
		discord_token_bot: discord_token_bot,
		discord_token_self: discord_token_self
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
