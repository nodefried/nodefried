# Welcome to the Nodefried Documentation
## INIT

### Constants
```js
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
const request = require("request");
const http = require("http");
const config = require('./config.json');
const { bot_nickname, bot_api_key, bot_web_port } = config;
```




## FUNCTIONS

### Write Operator Data
```js
function operatorSave(operator) {
	fs.writeFile('operator', operator, function(err) {
	});
	console.log(timeStampLog()+'Wrote operator name and DNA to record...'.gray);
}
```


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
		botConsole();
	}
	if (systemOS === "win32") {
		exec("ping -n 5 "+host, puts);
	} else {		
		exec("ping -c 5 "+host, puts);
	}
}
```


### System Shell
Super, super dangerous. You have been warned.
But just in case, it's disabled by default.
```js
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
	return bot_nickname.toLowerCase().yellow+'@localhost'.yellow+' ##_\ '.trap.bold.cyan;
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
```


### Web Server
```js
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
```


### Documentation Generator
```js
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
```


### Config Check/Setup Function
```js
function setupConfig(query, status) {
	if (fs.existsSync('config.json')) {
			status(console.log(timeStampLog()+'Welcome back!'));
	} else {
			fs.readFile('example.config.json', 'utf8', function (err,data) {
					if (err) {
							return console.log(err);
					}
					fs.writeFile('config.json', data, 'utf8', function (err) {
							if (err) return console.log(err);
							status(console.log(timeStampLog()+'Config generation done!'.bold.green));
					});
			});	
	}
}
```




## RUNTIME

### Initial Prompt and Console
You must adhere to the comment policy in order for the documentation function to work.
It's a pain in the ass but it works.
```js
setupConfig(null, function(status) {
	botConsole();
});
```



