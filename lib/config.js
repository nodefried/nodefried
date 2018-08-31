// START SECTION: INIT

// START SUB: Constants
/* START */
const colors = require('colors');
const fs = require('fs');
const http = require('http');
const initPath = __dirname.replace(/lib/g, '');
/* END */
// END SUB: Constants

// START SUB: Config Check/Setup Function
/* START */
if (fs.existsSync(initPath+'/config/config.json')) {
	const conf = require(initPath+'//config//config.json');
	http.get('http://bot.whatismyipaddress.com', function(res){
		res.setEncoding('utf8');
		res.on('data', function(chunk){
			var fileNameConfig = initPath+'/config/config.json';
			var fileNamePeers = initPath+'/config/peers.json';			
			var fileConfig = require(fileNameConfig);
			var filePeers = require(fileNamePeers);
			var isWin = /^win/.test(process.platform);
			var isDarwin = /^darwin/.test(process.platform);
			if(isWin) { 
				var host = "win32"; 
			} else if(isDarwin) {
				var host = "osx";
			} else {
				var host = "linux";
			}
			fileConfig.host_ip = chunk;
			fileConfig.host_os = host;
			
			filePeers[chunk] = fileConfig;
		
			fs.writeFile(fileNameConfig, JSON.stringify(fileConfig, null, '\t'), function (err) {
			  if (err) return console.log(err);
			});
			fs.writeFile(fileNamePeers, JSON.stringify(filePeers, null, '\t'), function (err) {
				if (err) return console.log(err);
			});			
		});
	});
    if (conf.bot_motd_disable != true) {
		console.log("");
		console.log("                 ."+"###".red+"`");
		console.log("                ,"+"#####".red+"`");
		console.log("                 ####".red+"+");
		console.log("                  '"+"#".gray+";");
		console.log("                  ,"+"#".gray+"`");
		console.log("                  ,"+"#".gray+"`");
		console.log("    '"+"#############################".gray+";");
		console.log("    ###############################".gray);
		console.log(" ,,,"+"###############################".gray+",,");
		console.log("`"+"#########`".gray+"##,".bold.blue+"'#########:".gray+"'##".bold.blue+"`#########".gray);
		console.log(":"+"########` ".gray+"##,".bold.blue+" ########+ ".gray+"+##".bold.blue+" .########".gray+".");
		console.log(":"+"########   ".gray+"`".bold.blue+"  ,#######`  ".gray+".".bold.blue+"   ########".gray+".");
		console.log(":"+"########      ,#######`      ########".gray+".");
		console.log(":"+"########      ########'     .########".gray+".");
		console.log(":"+"#########    :#########.   `#########".gray+".");
		console.log(":"+"##########++#############++##########".gray+".");
		console.log("."+"#####################################".gray);
		console.log(" ```"+"###############################".gray+"``");
		console.log("    ##############################".gray+"+");
		console.log("     `````````````````````````````".white);
		console.log('Welcome back! Type '.reset+'help'.inverse+' for commands.'.reset);
		console.log('Docs located in ./docs after '.reset+'docs markup'.inverse+' and '+'docs html'.inverse+' commands have been run.'.reset);
		console.log('To disable this motd, set '+'bot_motd_disable'.bold.yellow+' as '+'true'.bold.yellow+' in your config/config.json.');
	}
	module.exports = {
		bot_nickname: conf.bot_nickname,
		bot_api_key: conf.bot_api_key,
		bot_port_web: conf.bot_port_web,
		bot_port_com: conf.bot_port_com,
		bot_logo_long: conf.bot_logo_long,
		bot_logo_square: conf.bot_logo_square,
		bot_info_website: conf.bot_info_website,
		bot_info_copyright: conf.bot_info_copyright,
		bot_shell_whitelist: conf.bot_shell_whitelist,
		bot_motd_disable: conf.bot_motd_disable,
		discord_token_bot: conf.discord_token_bot,
		discord_token_self: conf.discord_token_self,
		web_title: conf.web_title,
		web_favicon: conf.web_favicon,
		dropbox_token: conf.dropbox_token,
		host_ip: conf.host_ip,
		host_os: conf.host_os
	}
} else {
	console.log('You did not have a default config.json, so we created one for you. Re-run the command.'.rainbow);
	function writeConfig() {
		fs.readFile(initPath+'/config/example.config.json', 'utf8', function (err,data) {
			if (err) {
					return console.log(err);
			}
			fs.writeFile(initPath+'/config/config.json', data, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			fs.writeFile(initPath+'/config/peers.json', '{}', 'utf8', function (err) {
				if (err) return console.log(err);
			});		
		})
	}
	writeConfig(function() {
		process.exit();
	});
}
/* END */
// END SUB: Config Check/Setup Function

// END SECTION: INIT
