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
//const conf = require('./lib/main.js');
const discord = require('./lib/discord_bot.js');
const blessed = require('blessed');
var eventEmitter = require('events').EventEmitter;
var ee = new eventEmitter;
ee.on('botConsole', botConsole);
ee.on('botDiscord', discord.botDiscord);

const { Client } = require('discord.js');

function timeStampLog() {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	return dt.format('Y-m-d H:M:S').bold.green+'| ';
}

function prompt(question, callback) {
	var stdin = process.stdin,
	stdout = process.stdout;
	stdin.resume();
	stdout.write(question);
	stdin.once('data', function (data) {
		callback(data.toString().trim());
	});
}

function botConsolePrompt() {
	return 'test'.toLowerCase().yellow+'@localhost'.yellow+' ##_\ '.trap.bold.cyan;
}

function botDiscord(operation) {
	if(operation == "START") {
		client = new Client();
		client.on('ready', () => {
			console.log('');
			console.log("test"+" Discord BOT is ready for you!");
			console.log('');
			ee.emit('botConsole');
			//ee.on('discordBotStop', discordBotStop);
			//function discordBotStop() {
			//		client.destroy();
			//		console.log('');
			//		console.log('Discord BOT has disconnected!');
			//		console.log('');
			//		//callback(true);
			//		ee.emit('botConsole');
			//}	
		});
		client.login("NDg0MTI0MTUzMzIzMDYxMjQ4.DmdbcA.4_sqdvuuOh2ZQ4Gv6gaUMYxHFZ8");	
	} else if(operation == "STOP") {
		client.destroy();
		console.log('');
		console.log("test"+" Discord BOT has terminated!");
		console.log('');		
		ee.emit('botConsole');
	}
}
function botConsole() {
	prompt(timeStampLog()+botConsolePrompt(), function(botCommand) {
		var arguments = botCommand.toUpperCase().split(/(\s+)/);
		if(arguments[0].toUpperCase() == "EXIT") {
				console.log(timeStampLog()+'Exiting back to console...');
				process.exit();
		} else if(arguments[0].toUpperCase() == "WEB") {
			webServer(arguments[2]);
		} else if(arguments[0].toUpperCase() == "DISCORDBOT") {
			botDiscord(arguments[2]);
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
		}
	});
}
botConsole();