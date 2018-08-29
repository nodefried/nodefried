// START SECTION: INIT

// START SUB: Constants
/* START */
const colors = require('colors');
const fs = require('fs');
const initPath = __dirname.replace(/lib/g, '');
const conf = require(initPath+'/config/config.json');
/* END */
// END SUB: Constants

// START SUB: Config Check/Setup Function
/* START */
if (fs.existsSync(initPath+'/config/config.json')) {
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
	}	
	var config = require(initPath+'/config/config.json');
	var { bot_nickname, bot_api_key, bot_port_web, bot_port_com, bot_shell_whitelist, discord_token_bot, discord_token_self, bot_logo_long, bot_logo_square, bot_info_website, bot_info_copyright, bot_motd_disable, web_title, web_favicon } = config;
	module.exports = {
		bot_nickname: bot_nickname,
		bot_api_key: bot_api_key,
		bot_port_web: bot_port_web,
		bot_port_com: bot_port_com,
		bot_logo_long: bot_logo_long,
		bot_logo_square: bot_logo_square,
		bot_info_website: bot_info_website,
		bot_info_copyright: bot_info_copyright,
		bot_shell_whitelist: bot_shell_whitelist,
		bot_motd_disable: bot_motd_disable,
		discord_token_bot: discord_token_bot,
		discord_token_self: discord_token_self,
		web_title: web_title,
		web_favicon: web_favicon
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
