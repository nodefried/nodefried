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
const init = require('./lib/init.js');
/* END */
// END SUB: Constants

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
		botConsole();
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
		botConsole();
	}
	if(argument.toUpperCase() == 'HISTORY') {
		if (systemOS === "win32") {
			exec('git log --pretty=format:"%h - %an (%ae): %s" --shortstat  -n 3', puts);
		} else {		
			exec('git log --pretty=format:"%h - %an (%ae): %s" --shortstat  -n 3', puts);
		}
	}
	if(argument.toUpperCase() == 'PULL') {
		if (systemOS === "win32") {
			exec('git stash && git pull', puts);
		} else {		
			exec('git stash && git pull', puts);
		}
	}	
}
/* END */
// END SUB: Git Operations

// START SUB: Config Operations
/* START */
function config(argument) {
	var sys = require('util');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { 
		console.log(stdout);
		botConsole();
	}
	if(argument.toUpperCase() == 'SHOW') {
		if (systemOS === "win32") {
			exec('type config.json', puts);
		} else {		
			exec('cat config.json', puts);
		}
	}
	if(argument.toUpperCase() == 'BACKUP') {
		if (systemOS === "win32") {
			exec('copy config.json config.json.backup', puts);
		} else {		
			exec('cp config.json config.json.backup', puts);
		}
	}	
	if(argument.toUpperCase() == 'WIPE') {
		if (systemOS === "win32") {
			exec('del config.json', puts);
		} else {		
			exec('rm config.json', puts);
		}
	}	
}
/* END */
// END SUB: Config Operations

// START SUB: System Shell
// COMMENT: Super, super dangerous. You have been warned.
// COMMENT: But just in case, it's disabled by default.
/* START */
function shell(command) {
	var sys = require('util');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { 
		console.log(stdout);
		botConsole();
	}
	if (systemOS === "win32") {
		exec(command, puts);
	} else {		
		exec(command, puts);
	}
}
/* END */
// END SUB: Sytem Shell

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
	return init.bot_nickname.toLowerCase().yellow+'@localhost'.yellow+' ##_\ '.trap.bold.cyan;
}
/* END */
// END SUB: Console Prompt

// START SUB: Console
/* START */
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
		} else {
			/*shell(botCommand);*/
			console.log(timeStampLog()+'Not a command...');
			botConsole();
		}
	})
}
/* END */
// END SUB: Console

// START SUB: Web Server
/* START */
function webServer(action) {
	const web = express();
	if (action.toUpperCase() == "START") {
		const server = web.listen(init.bot_web_port);
		web.get('/', (req,res) => {
			res.send('Web server started successfully...');
		});
		web.get('/api/'+init.bot_api_key+'/close', (req,res) => {
			server.close();
		});
		web.get('/api/'+init.bot_api_key+'/status', (req,res) => {
			res.send('Web server IS online...');
		});
		console.log(timeStampLog()+'Web server started successfully!'.green);
		botConsole();
	} else if(action.toUpperCase() == "STOP") {
		var webBackendClose = 'http:\/\/localhost:'+init.bot_web_port+'/api/'+init.bot_api_key+'/close';
		var webBackendStatus = 'http:\/\/localhost:'+init.bot_web_port+'/api/'+init.bot_api_key+'/status';
		request({
			url: webBackendClose,
			timeout: 5000
		}, function (error,response,body) {
			console.log(timeStampLog()+'Web server stopped successfully!'.red);
			botConsole();
		})
	} else if(action.toUpperCase() == "STATUS") {
                var webBackendStatus = 'http:\/\/localhost:'+init.bot_web_port+'/api/'+init.bot_api_key+'/status';
                request({
                        url: webBackendStatus,
                        timeout: 1000
                }, function (error,response,body) {
			if (error) { 
				console.log(timeStampLog()+'Web Server IS NOT online...'.bold.red);
			} else {
				console.log(timeStampLog()+'Web Server IS online...'.bold.green);
			}
                        botConsole();
                })
        }
}
/* END */
// END SUB: Web Server

// START SUB: Documentation Generator
/* START */
function generateDocumentation() {
	console.log(timeStampLog()+'Documentation generation beginning... please wait...'.yellow);
	fs.readFile('nodefried.js', 'utf8', function (err,data) {
		if (err) {
			return console.log(timeStampLog()+err);
		}
		var result = data
			.replace(/#!\/usr\/bin\/env node/g,
				'# Welcome to the '+init.bot_nickname+' Documentation')
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
	botConsole();
}
/* END */
// END SUB: Main Generator

// END SECTION: FUNCTIONS

// START SECTION: RUNTIME

// START SUB: Initial Prompt and Console
// COMMENT: This doesn't do much. It will create a basic config and launch the console.
// COMMENT: Once in the console you can call any of the functions via built-in commands.
/* START */
if (fs.existsSync('./lib/config.json')) {
	botConsole();
}
/* END */
// END SUB: Initial Prompt and Console

// END SECTION: RUNTIME
