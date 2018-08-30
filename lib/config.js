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
    const conf = require(initPath+'//config//config.json');
    if (conf.bot_motd_disable != true) {
		console.log("");
		console.log("                 ."+"###".red+"`");
		console.log("                ,"+"#####".red+"`");
		console.log("                ,"+"#####".red+"`");
		console.log("                 ####".red+"+");
		console.log("                  '"+"#".gray+";");
		console.log("                  ,"+"#".gray+"`");
		console.log("                  ,"+"#".gray+"`");
		console.log("                  ,"+"#".gray+"`");
		console.log("    '"+"#############################".gray+";");
		console.log("    ###############################".gray);
		console.log("    ###############################".gray);
		console.log(" ```"+"###############################".gray+"``");
		console.log("`"+"#########`".gray+"##,".bold.blue+"'#########:".gray+"'##".bold.blue+"`#########".gray);
		console.log(":"+"########` ".gray+"##,".bold.blue+" ########+ ".gray+"+##".bold.blue+" .########".gray+".");
		console.log(":"+"########   ".gray+"`".bold.blue+"  ,#######`  ".gray+".".bold.blue+"   ########".gray+".");
		console.log(":"+"########      ,#######`      ########".gray+".");
		console.log(":"+"########      ########'     .########".gray+".");
		console.log(":"+"#########    :#########.   `#########".gray+".");
		console.log(":"+"##########++#############++##########".gray+".");
		console.log("."+"#####################################".gray);
		console.log(" `.."+"###############################".gray+"..`");
		console.log("    ###############################".gray);
		console.log("    ##############################".gray+"+");
		console.log("     `````````````````````````````".white);
		console.log('Welcome back! Type '.reset+'help'.inverse+' for commands.'.reset);
		console.log('Docs located in ./docs after '.reset+'docs markup'.inverse+' and '+'docs html'.inverse+' commands have been run.'.reset);
		console.log('To disable this motd, set '+'bot_motd_disable'.bold.yellow+' as '+'true'.bold.yellow+' in your config/config.json.');
	}
	var config = require(initPath+'/config/config.json');
	module.exports = {
		bot_nickname: config.bot_nickname,
		bot_api_key: config.bot_api_key,
		bot_port_web: config.bot_port_web,
		bot_port_com: config.bot_port_com,
		bot_logo_long: config.bot_logo_long,
		bot_logo_square: config.bot_logo_square,
		bot_info_website: config.bot_info_website,
		bot_info_copyright: config.bot_info_copyright,
		bot_shell_whitelist: config.bot_shell_whitelist,
		bot_motd_disable: config.bot_motd_disable,
		discord_token_bot: config.discord_token_bot,
		discord_token_self: config.discord_token_self,
		web_title: config.web_title,
		web_favicon: config.web_favicon,
		dropbox_token: config.dropbox_token
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
