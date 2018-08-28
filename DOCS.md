# Welcome to the Nodefried Documentation
## INIT

### Constants
```js
const { Client } = require('discord.js');
client = new Client();
const sys = require('util');
const exec = require('child_process').exec;
const cluster = require('cluster');
const os = require('os');
const systemOS = os.platform();
const prettySize = require('prettysize');
const prettyMs = require('pretty-ms');
const ffmpeg = require('fluent-ffmpeg');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const express = require('express');
const request = require('request');
const http = require('http');
const conf = require('./lib/main.js');
const blessed = require('blessed');
var eventEmitter = require('events').EventEmitter;
var ee = new eventEmitter;
ee.on('botConsole', botConsole);
//Doesn't Work on Win32 (No Signals)
process.on("SIGINT", function() { 
	console.log('' ); 
	console.log('Received SIGINT, killing current command...'); 
});
```




## FUNCTIONS

### Timestamp Log
```js
function timeStampLog() {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	return dt.format('Y-m-d H:M:S').bold.green+'| ';
}
```


### Timestamp Normal
```js
function timeStamp() {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	return dt.format('Y-m-d H:M:S');
}
```


### Ping
```js
function ping(host) {
	var sys = require('util');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { 
		console.log(stdout);
		ee.emit('botConsole');
	}
	if (systemOS === "win32") {
		exec("ping -n 5 "+host, puts);
	} else {		
		exec("ping -c 5 "+host, puts);
	}
}
```


### Git Operations
```js
function git(argument) {
	var sys = require('util');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { 
		console.log(stdout);
		ee.emit('botConsole');
	} 
	if(argument.toUpperCase() == 'HISTORY') {
		if (systemOS === "win32") {
			exec('git log --pretty=format:"%h - %an (%ae): %s" --shortstat  -n 3', puts);
		} else {		
			exec('git log --pretty=format:"%h - %an (%ae): %s" --shortstat  -n 3', puts);
		}
	} else if(argument.toUpperCase() == 'PULL') {
		if (systemOS === "win32") {
			exec('git stash && git pull', puts);
		} else {		
			exec('git stash && git pull', puts);
		}
	} else {
				console.log(timeStampLog()+'Usage: git history/pull'.bold.green);
				ee.emit('botConsole');
	}	
}
```


### Config Operations
```js
function config(argument) {
	var sys = require('util');
	var exec = require('child_process').exec;
	var config = process.cwd()+'/config/config.json';
	var configBackup = process.cwd()+'/config/config.json.backup';
	function puts(error, stdout, stderr) { 
		console.log(stdout);
		ee.emit('botConsole');
	}
	if(argument.toUpperCase() == 'SHOW') {
		fs.readFile('./config/config.json', 'utf8', function (err,data) {
			if (err) {
				console.log(timeStampLog()+err);
			}
			console.log(data);
			ee.emit('botConsole');
		});
	} else if(argument.toUpperCase() == 'BACKUP') {
		fs.readFile(config, 'utf8', function (err,data) {
			if (err) {
				return console.log(timeStampLog()+err);
			}
			fs.writeFile(configBackup, data, 'utf8', function (err) {
				if (err) return console.log(timeStampLog()+err);
				console.log(timeStampLog()+
					'Backup saved to config/config.json.backup!'.bold.green);
				ee.emit('botConsole');
			});
		});
	} else if(argument.toUpperCase() == 'WIPE') {
		fs.unlinkSync('./config/config.json', 'utf8', function (err,data) {
			if (err) {
				console.log(timeStampLog()+err);
			}
		});
		console.log(timeStampLog()+'Sucessfully wiped the config, exiting the program!'.bold.red);
		process.exit();
	} else {
				console.log(timeStampLog()+'Usage: config show/backup/wipe'.bold.green);
				ee.emit('botConsole');
	}
}
```


### Blessed Example
```js
function doSomething() {
	var screen = blessed.screen({
		tput: true,
		smartCSR: true,
		dump: __dirname + '/logs/prompt.log',
		autoPadding: true,
		warnings: true
	});
	var prompt = blessed.prompt({
		parent: screen,
		border: 'line',
		height: 'shrink',
		width: 'half',
		top: 'center',
		left: 'center',
		label: ' {blue-fg}Prompt{/blue-fg} ',
		tags: true,
		keys: true,
		vi: true
	});
	var question = blessed.question({
		parent: screen,
		border: 'line',
		height: 'shrink',
		width: 'half',
		top: 'center',
		left: 'center',
		label: ' {blue-fg}Question{/blue-fg} ',
		tags: true,
		keys: true,
		vi: true
	});
	var msg = blessed.message({
		parent: screen,
		border: 'line',
		height: 'shrink',
		width: 'half',
		top: 'center',
		left: 'center',
		label: ' {blue-fg}Message{/blue-fg} ',
		tags: true,
		keys: true,
		hidden: true,
		vi: true
	});
	var loader = blessed.loading({
		parent: screen,
		border: 'line',
		height: 'shrink',
		width: 'half',
		top: 'center',
		left: 'center',
		label: ' {blue-fg}Loader{/blue-fg} ',
		tags: true,
		keys: true,
		hidden: true,
		vi: true
	});
	prompt.input('Question?', '', function(err, value) {
		question.ask('Question?', function(err, value) {
			msg.display('Hello world!', 3, function(err) {
				msg.display('Hello world again!', -1, function(err) {
					loader.load('Loading...');
					setTimeout(function() {
						loader.stop();
						screen.destroy();
						ee.emit('botConsole');
					}, 3000);
				});
			});
		});
	});
	screen.key('q', function() {
		screen.destroy();
		ee.emit('botConsole');	
	});
	screen.render();
}
```


### Prompt
```js
function prompt(question, callback) {
	var stdin = process.stdin,
	stdout = process.stdout;
	stdin.resume();
	stdout.write(question);
	stdin.once('data', function (data) {
		callback(data.toString().trim());
	});
}
```


### Console Prompt
```js
function botConsolePrompt() {
	return conf.bot_nickname.toLowerCase().yellow+'@localhost'.yellow+' ##_\ '.trap.bold.cyan;
}
```


### Console
```js
function botConsole() {
	prompt(timeStampLog()+botConsolePrompt(), function(botCommand) {
		var arguments = botCommand.split(/(\s+)/);
		if(arguments[0].toUpperCase() == "EXIT") {
				console.log(timeStampLog()+'Exiting back to console...');
				process.exit();
		} else if(arguments[0].toUpperCase() == "WEB") {
			webServer(arguments[2]);
		} else if(arguments[0].toUpperCase() == "CONFIG") {
			config(arguments[2]);
		} else if(arguments[0].toUpperCase() == "PING") {
			console.log(timeStampLog()+'Pinging host, please wait...');
			let host = arguments[2];
			ping(host);
		} else if(arguments[0].toUpperCase() == "GIT") {
			console.log(timeStampLog()+'Working with repository, please wait...');
			let argument = arguments[2];
			git(argument);
		} else if (arguments[0].toUpperCase() == "DOCS") {
			generateDocumentation();
		} else if (arguments[0].toUpperCase() == "DO") {
			doSomething();
		} else if (arguments == "" || !arguments) {
			console.log(timeStampLog()+'Need to enter a command...'.yellow);
			ee.emit('botConsole');
		} else {
			var sys = require('util');
			var exec = require('child_process').exec;
			function puts(error, stdout, stderr) { 
				console.log(stdout);
				ee.emit('botConsole');
			}
			if(conf.bot_shell_whitelist.indexOf(arguments[0])!=-1) {
				exec(botCommand, puts);
			} else {		
				console.log(timeStampLog()+'This command is blackisted!');	
				ee.emit('botConsole');
			}
		}
	});
}
```


### Web Server
```js
function webServer(action) {
	const web = express();
	if (action.toUpperCase() == "START") {
		const server = web.listen(conf.bot_web_port);
		web.get('/', (req,res) => {
			res.send('Web server started successfully...');
		});
		web.get('/api/'+conf.bot_api_key+'/close', (req,res) => {
			server.close();
		});
		web.get('/api/'+conf.bot_api_key+'/status', (req,res) => {
			res.send('Web server IS online...');
		});
		console.log(timeStampLog()+'Web server started successfully!'.green);
		ee.emit('botConsole');
	} else if(action.toUpperCase() == "STOP") {
		var webBackendClose = 
			'http:\/\/localhost:'+conf.bot_web_port+'/api/'+conf.bot_api_key+'/close';
		var webBackendStatus = 
			'http:\/\/localhost:'+conf.bot_web_port+'/api/'+conf.bot_api_key+'/status';
		request({
			url: webBackendClose,
			timeout: 5000
		}, function (error,response,body) {
			console.log(timeStampLog()+'Web server stopped successfully!'.red);
			ee.emit('botConsole');
		})
	} else if(action.toUpperCase() == "STATUS") {
                var webBackendStatus = 
			'http:\/\/localhost:'+conf.bot_web_port+'/api/'+conf.bot_api_key+'/status';
                request({
                        url: webBackendStatus,
                        timeout: 1000
                }, function (error,response,body) {
			if (error) { 
				console.log(timeStampLog()+'Web Server IS NOT online...'.bold.red);
			} else {
				console.log(timeStampLog()+'Web Server IS online...'.bold.green);
			}
			ee.emit('botConsole');
                })
        }
}
```


### Documentation Generator
```js
function generateDocumentation() {
	console.log(timeStampLog()+'Documentation generation beginning... please wait...'.yellow);
	fs.readFile('init.js', 'utf8', function (err,data) {
		if (err) {
			return console.log(timeStampLog()+err);
		}
		var result = data
			.replace(/#!\/usr\/bin\/env node/g,
				'# Welcome to the '+conf.bot_nickname+' Documentation')
			.replace(/\/\/ START SECTION: /g,
				'## ')
			.replace(/\/\/ END SECTION: (.+)/g,
				'')
			.replace(/\/\/ START SUB: /g,
				'### ')
			.replace(/\/\/ END SUB: (.+)/g,
				'')
			.replace(/\/\/ COMMENT: /g,
				'')
			.replace(/\/\* START \*\//g,
				'```js')
			.replace(/\/\* END \*\//g,
				'```');
		fs.writeFile('DOCS.md', result, 'utf8', function (err) {
			if (err) return console.log(timeStampLog()+err);
		});
	});
	console.log(timeStampLog()+'Documentation generation done!'.bold.green);
	ee.emit('botConsole');
}
```




## RUNTIME

### Initial Prompt and Console
This doesn't do much. It will create a basic config and launch the console.
Once in the console you can call any of the functions via built-in commands.
```js
if (fs.existsSync(__dirname+'/config/config.json')) {
	ee.emit('botConsole');
	client.on('ready', () => {
		console.log("\n\n\n");
		console.log(conf.bot_nickname+" is ready for you!");
		console.log("---------------------------");
		console.log("Bot is Ready!");
		console.log("---------------------------");
		//A();
	});
	client.login(conf.discord_token_bot);
}
```



