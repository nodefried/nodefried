// START SECTION: INIT

// START SUB: Constants
/* START */
const colors = require('colors');
const fs = require('fs');
const http = require('http');
const initPath = __dirname.replace(/lib/g, '');
const conf = require(initPath+'//config//config.json');
const MongoClient = require('mongodb').MongoClient;
const mongoURI = conf.mongodb_uri;
const assert = require('assert');

/* END */
// END SUB: Constants

// START SUB: Config Check/Setup Function
/* START */
if (fs.existsSync(initPath+'/config/config.json')) {
	const node_dropbox = require('node-dropbox-v2');
	const dropbox = node_dropbox.api(conf.dropbox_token);
	http.get('http://bot.whatismyipaddress.com', function(res){
		res.setEncoding('utf8');
		res.on('data', function(chunk){
			var isWin = /^win/.test(process.platform);
			var isDarwin = /^darwin/.test(process.platform);
  		if(isWin) { 
				var host = "win32"; 
			} else if(isDarwin) {
				var host = "osx";
			} else {
        var host = "linux";
      }
      var timeStamp = + new Date();
      var fileNameConfig = initPath+'/config/config.json';
  		var fileConfig = require(fileNameConfig);
      fileConfig.host_ip = chunk;
      fileConfig.host_os = host;
      fileConfig.host_last_updated = timeStamp;
			fs.writeFile(fileNameConfig, JSON.stringify(fileConfig, null, '\t'), function (err) {
			  if (err) return console.log(err);
      }); 
      // old code to use dropbox as config sync     
      // else if(conf.dropbox_token){
      //   dropbox.getFile('controller/peers.json', (err, res, body) => {
      //     if (!err) {
      //       fs.writeFile('config/peers.json', body, {ecoding: 'utf8'}, (err) => {
      //         if (!err) {
      //           var fileNamePeers = initPath+'/config/peers.json';			
      //           var filePeers = require(fileNamePeers);
      //           filePeers[chunk] = fileConfig;
      //           fs.writeFile(fileNamePeers, JSON.stringify(filePeers, null, '\t'), function (err) {
      //             if (!err) {
      //               fs.readFile('config/peers.json', 'utf8', (err, data) => {
      //                 if (!err) {
      //                   dropbox.createFile('controller/peers.json',  JSON.stringify(filePeers, null, '\t'), (err, res, body) => {
      //                     if (!err) {
      //                     } else if(err) {
      //                     }
      //                   });
      //                 }
      //               });  
      //             }					
      //           });	            
      //         }
      //       });
      //     } else if(err) {
      //     }
      //   });  
      // }
      if(conf.mongodb_uri){
        MongoClient.connect(conf.mongodb_uri, { useNewUrlParser: true }, function(err, db) {
          if (err) throw err;
          var dbo = db.db(conf.mongodb_dbname);  
          dbo.createCollection("peers", function(err, res) {
          });
          var fileNameConfig = initPath+'/config/config.json';
          var fileConfig = require(fileNameConfig);    
          var lookup = { host_ip: chunk };
          var peerUpdateInfo = { $set: fileConfig };
          dbo.collection("peers").updateOne(lookup, peerUpdateInfo, {upsert: true, safe: false}, function(err, res) {
            if (err) throw err;
          });                
        });   
      }
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
		bot_logo_long: conf.bot_logo_long,
		bot_logo_square: conf.bot_logo_square,
		bot_info_website: conf.bot_info_website,
		bot_info_copyright: conf.bot_info_copyright,
		bot_shell_whitelist: conf.bot_shell_whitelist,
		bot_motd_disable: conf.bot_motd_disable,
		bot_mode: conf.bot_mode,
		discord_token_bot: conf.discord_token_bot,
		discord_token_self: conf.discord_token_self,
		web_title: conf.web_title,
		web_favicon: conf.web_favicon,
		dropbox_token: conf.dropbox_token,
		cloudflare_email: conf.cloudflare_email,
		cloudflare_api_key: conf.cloudflare_api_key,
		cloudflare_domain: conf.cloudflare_domain,
		cloudflare_records: conf.cloudflare_records,
		host_ip: conf.host_ip,
		host_os: conf.host_os,
		host_status: conf.host_status,
		host_last_updated: conf.host_last_updated,
		mongodb_uri: conf.mongodb_uri,
		mongodb_dbname: conf.mongodb_dbname
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
