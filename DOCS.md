#!/usr/bin/env node

// START SECTION: SYSTEM

// START SUB: Variables
/* START */
try {	
	var sys = require('util');
	var exec = require('child_process').exec;
	var cluster = require('cluster');
	var os = require('os');
	var systemOS = os.platform();
	var prettySize = require('prettysize');
	var prettyMs = require('pretty-ms');
	var ffmpeg = require('fluent-ffmpeg');
	var colors = require('colors');
} catch(error) {
	var fs = require('fs');
	console.log(timeStampLog()+'Could not load a required package, exiting!'.bold.red);
	fs.readFile('example.config.json', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		var result = data
			.replace(/#!\/usr\/bin\/env node/g,
				'# Welcome to the '+bot_nickname+' Documentation')
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
		fs.writeFile('config.json', result, 'utf8', function (err) {
			if (err) return console.log(err);
		});
	});
	console.log(timeStampLog()+'Documentation generation done!'.bold.green);
	process.exit();
}
/* END */
// END SUB: Variables

// START SUB: Constants
/* START */
try {
	const config = require('./config.json');
} catch(error) {
	console.log(timeStampLog()+'No config.json found, exiting!'.bold.red);
	process.exit();
}
try {
	const fs = require('fs');
	const path = require('path');
	const express = require('express');
	const request = require("request");
	const http = require("http");
	bot_nickname = "Nodefried";
	bot_web_port = config.bot_web_port;
	bot_api_key = config.bot_api_key;
} catch(error) {
	console.log(timeStampLog()+'Could not load a required package, exiting!'.bold.red);
	process.exit();
}

/* END */
// END SUB: Constants

// END SECTION: SYSTEM

// START SECTION: FUNCTIONS

// START SUB: Write Operator Data
/* START */
function operatorSave(operator) {
	fs.writeFile('operator', operator, function(err) {
	});
	console.log(timeStampLog()+'Wrote operator name and DNA to record...'.gray);
}
/* END */
// END SUB: Write Operator Data

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
	return bot_nickname.toLowerCase().yellow+'@localhost'.yellow+' ##_\ '.trap.bold.cyan;
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
		} else if(arguments[0].toUpperCase() == "PING") {
			console.log(timeStampLog()+'Pinging host, please wait...');
			let host = arguments[2];
			ping(host);
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
		const server = web.listen(bot_web_port);
		web.get('/', (req,res) => {
			res.send('Web server started successfully...');
		});
		web.get('/api/'+bot_api_key+'/close', (req,res) => {
			server.close();
		});
		web.get('/api/'+bot_api_key+'/status', (req,res) => {
			res.send('Web server IS online...');
		});
		console.log(timeStampLog()+'Web server started successfully!'.green);
		botConsole();
	} else if(action.toUpperCase() == "STOP") {
		var webBackendClose = 'http:\/\/localhost:'+bot_web_port+'/api/'+bot_api_key+'/close';
		var webBackendStatus = 'http:\/\/localhost:'+bot_web_port+'/api/'+bot_api_key+'/status';
		request({
			url: webBackendClose,
			timeout: 5000
		}, function (error,response,body) {
			console.log(timeStampLog()+'Web server stopped successfully!'.red);
			botConsole();
		})
	} else if(action.toUpperCase() == "STATUS") {
                var webBackendStatus = 'http:\/\/localhost:'+bot_web_port+'/api/'+bot_api_key+'/status';
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
				'# Welcome to the '+bot_nickname+' Documentation')
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
// COMMENT: You must adhere to the comment policy in order for the documentation function to work.
// COMMENT: It's a pain in the ass but it works.
/* START */
if (fs.existsSync('operator')) {
	var readStream = fs.createReadStream(path.join(__dirname, '/') + 'operator', 'utf8');
	let data = ''
	readStream.on('data', function(chunk) {
		data += chunk;
	}).on('end', function() {
		console.log(timeStampLog()+'Welcome back '+data+'!');
		botConsole();
	});
} else {

	prompt(timeStampLog()+'What is my operators name? ', function (var_operator_name) {
		operatorSave(var_operator_name);
		console.log(timeStampLog()+'Hello '+var_operator_name+', I am '+bot_nickname+'.');
		botConsole();
	});
}
/* END */
// END SUB: Initial Prompt and Console

// END SECTION: RUNTIME
