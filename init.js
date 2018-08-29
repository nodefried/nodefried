#!/usr/bin/env node
// START SECTION: INIT

// START SUB: Constants
/* START */
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
const conf = require('./lib/config.js');
const blessed = require('blessed');
const { Client } = require('discord.js');
/* END */
// END SUB: Constants

// START SUB: Events and Signals
/* START */
var eventEmitter = require('events').EventEmitter;
var ee = new eventEmitter;
ee.on('botConsole', botConsole);
//Doesn't Work on Win32 (No Signals)
process.on("SIGINT", function() { 
	console.log('' ); 
	console.log('Received SIGINT, killing current command...'); 
});
/* END */
// END SUB: Events and Signals

// END SECTION: INIT

// START SECTION: FUNCTIONS

// START SUB: Timestamp Log
/* START */
function timeStampLog() {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	return dt.format('Y-m-d H:M:S').bold.green+'| ';
}
/* END */
// END SUB: Timestamp Log

// START SUB: Timestamp Normal
/* START */
function timeStamp() {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	return dt.format('Y-m-d H:M:S');
}
/* END */
// END SUB: Timestamp Normal

// START SUB: Ping
/* START */
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
/* END */
// END SUB: Ping

// START SUB: Git Operations
/* START */
function git(argument) {
	var sys = require('util');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { 
		console.log(stdout);
		ee.emit('botConsole');
	} 
	if(argument == 'HISTORY') {
		if (systemOS === "win32") {
			exec('git log --pretty=format:"%h - %an (%ae): %s" --shortstat  -n 3', puts);
		} else {		
			exec('git log --pretty=format:"%h - %an (%ae): %s" --shortstat  -n 3', puts);
		}
	} else if(argument == 'PULL') {
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
/* END */
// END SUB: Git Operations

// START SUB: Config Operations
/* START */
function config(argument) {
	var sys = require('util');
	var exec = require('child_process').exec;
	var config = process.cwd()+'/config/config.json';
	var configBackup = process.cwd()+'/config/config.json.backup';
	function puts(error, stdout, stderr) { 
		console.log(stdout);
		ee.emit('botConsole');
	}
	if(argument == 'SHOW') {
		fs.readFile('./config/config.json', 'utf8', function (err,data) {
			if (err) {
				console.log(timeStampLog()+err);
			}
			console.log(data);
			ee.emit('botConsole');
		});
	} else if(argument == 'BACKUP') {
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
	} else if(argument == 'WIPE') {
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
/* END */
// END SUB: Config Operations

// START SUB: Blessed Example
/* START */
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
/* END */
// END SUB: BLESSED EXAMPLE

// START SUB: Prompt
/* START */
function prompt(question, callback) {
	var stdin = process.stdin,
	stdout = process.stdout;
	stdin.resume();
	stdout.write(question);
	stdin.once('data', function (data) {
		callback(data.toString().trim());
	});
}
/* END */
// END SUB: Prompt

// START SUB: Console Prompt
/* START */
function botConsolePrompt() {
	return conf.bot_nickname.toLowerCase().yellow+'@localhost'.yellow+' ##_\ '.trap.bold.cyan;
}
/* END */
// END SUB: Console Prompt

// START SUB: Discord Bot Controller
/* START */
function botDiscord(type,operation) {
	if(operation == "START") {
		if(type == "SELF") { 
			token = conf.discord_token_self; 
		} else if(type == "BOT") { 
			token = conf.discord_token_bot; 
		}
		client = new Client();
		client.on('ready', () => {
			console.log(timeStampLog()+conf.bot_nickname+" Discord "+type+" is ready for you!");
			ee.emit('botConsole');
		});
		client.login(token);	
	} else if(operation == "STOP") {
		client.destroy();
		console.log(timeStampLog()+conf.bot_nickname+" Discord "+type+" has terminated!");
		ee.emit('botConsole');
	}
}
/* END */
// END SUB: Discord Bot Controller

// START SUB: Console
/* START */
function botConsole() {
	if (fs.existsSync(__dirname+'/config/config.json')) {
	prompt(timeStampLog()+botConsolePrompt(), function(botCommand) {
		var arguments = botCommand.toUpperCase().split(/(\s+)/);
		if(arguments[0] == "EXIT") {
				console.log(timeStampLog()+'Exiting back to console...');
				process.exit();
		} else if(arguments[0] == "WEB") {
			webServer(arguments[2]);
		} else if(arguments[0] == "DISCORD") {
			botDiscord(arguments[2],arguments[4]);
		} else if(arguments[0] == "CONFIG") {
			config(arguments[2]);
		} else if(arguments[0] == "PING") {
			console.log(timeStampLog()+'Pinging host, please wait...');
			let host = arguments[2];
			ping(host);
		} else if(arguments[0] == "GIT") {
			console.log(timeStampLog()+'Working with repository, please wait...');
			let argument = arguments[2];
			git(argument);
		} else if (arguments[0] == "DOCS") {
			generateDocumentation();
		} else if (arguments[0] == "DO") {
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
			if(conf.bot_shell_whitelist.indexOf(arguments[0].toLowerCase())!=-1) {
				exec(botCommand, puts);
			} else {		
				console.log(timeStampLog()+'This command is blacklisted!');	
				ee.emit('botConsole');
			}
		}
	});
	}
}
/* END */
// END SUB: Console

// START SUB: Web Server
/* START */
function webServer(action) {
	const web = express();
	if (action == "START") {
		const server = web.listen(conf.bot_port_web);
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
	} else if(action == "STOP") {
		var webBackendClose = 
			'http:\/\/localhost:'+conf.bot_port_web+'/api/'+conf.bot_api_key+'/close';
		var webBackendStatus = 
			'http:\/\/localhost:'+conf.bot_port_web+'/api/'+conf.bot_api_key+'/status';
		request({
			url: webBackendClose,
			timeout: 5000
		}, function (error,response,body) {
			console.log(timeStampLog()+'Web server stopped successfully!'.red);
			ee.emit('botConsole');
		})
	} else if(action == "STATUS") {
                var webBackendStatus = 
			'http:\/\/localhost:'+conf.bot_port_web+'/api/'+conf.bot_api_key+'/status';
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
/* END */
// END SUB: Web Server

// START SUB: Documentation Generator
/* START */
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
	fs.readFile('DOCS.md', 'utf8', function (err,data) {
		if (err) {
			return console.log(timeStampLog()+err);
		}
		var result = data
			.replace(/# /g,
				'<h1>Welcome to the '+conf.bot_nickname+' Documentation</h1>')
			.replace(/## /g,
				'<hr><br /> ')
			.replace(/\/\/ END SECTION: (.+)/g,
				'')
			.replace(/\/\/ START SUB: /g,
				'')
			.replace(/\/\/ END SUB: (.+)/g,
				'')
			.replace(/\/\/ COMMENT: /g,
				'')
			.replace(/```js/g,
				'<pre>')
			.replace(/```/g,
				'</pre>');
		fs.writeFile('DOCS.html', result, 'utf8', function (err) {
			if (err) return console.log(timeStampLog()+err);
		});
	});	
	console.log(timeStampLog()+'Documentation generation done!'.bold.green);
	ee.emit('botConsole');
}
/* END */
// END SUB: Main Generator

// END SECTION: FUNCTIONS

// START SECTION: RUNTIME

// START SUB: Initial Prompt and Console
// COMMENT: Calls the console, which everything else calls back too... kinda.
/* START */
ee.emit('botConsole');
/* END */
// END SUB: Initial Prompt and Console

// END SECTION: RUNTIME
