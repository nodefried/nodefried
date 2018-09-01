#!/usr/bin/env node
// START SECTION: INIT

// START SUB: Constants
/* START */
// const keyboard = require('node-key-sender');
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
const request = require('request').defaults({ encoding: null });
const http = require('http');
const https = require('https');
const blessed = require('blessed');
const { Client } = require('discord.js');
const conf = require('./lib/config.js');
const node_dropbox = require('node-dropbox-v2');
const dropbox = node_dropbox.api(conf.dropbox_token);

const MongoClient = require('mongodb').MongoClient;
const mongoURI = conf.mongodb_uri;
const assert = require('assert');
const util = require('util');
const cloudflareddns = require('cloudflare-dynamic-dns2');
const log_file_debug = fs.createWriteStream(`${__dirname}/logs/debug.log`, { flags: 'w' });
const log_file_irc = fs.createWriteStream(`${__dirname}/logs/irc.log`, { flags: 'w' });
const log_file_discord = fs.createWriteStream(`${__dirname}/logs/discord.log`, { flags: 'w' });
const log_file_services = fs.createWriteStream(`${__dirname}/logs/services.log`, { flags: 'w' });
const log_file_peers = fs.createWriteStream(`${__dirname}/logs/peers.log`, { flags: 'w' });
const log_file_cloudflare = fs.createWriteStream(`${__dirname}/logs/cloudflare.log`, { flags: 'w' });
const log_stdout = process.stdout;
/* END */
// END SUB: Constants

// START SUB: File Logger
/* START */
console.fileLog = function (d, file) {
  file.write(`${timeStampLogPlain() + util.format(d)}\n`);
  // log_stdout.write(util.format(d) + '\n');
};
/* END */
// END SUB: File Logger

// START SUB: Events and Signals
/* START */
// var eventEmitter = require('events').EventEmitter;
// var ee = new eventEmitter;
// ee.on('botConsole', botConsole);
// ee.on('botConsolePrompt', botConsolePrompt);
// Doesn't Work on Win32 (No Signals)
process.on('SIGINT', () => {
  console.log('');
  console.log('Received SIGINT, killing current command...');
});
/* END */
// END SUB: Events and Signals

// END SECTION: INIT

// START SECTION: FUNCTIONS

// START SUB: Timestamp Log Pretty
/* START */
function timeStampLog() {
  const dateTime = require('node-datetime');
  const dt = dateTime.create();
  return `${dt.format('Y-m-d H:M:S').dim.magenta} | ${getStatusLine()} | `;
}
/* END */
// END SUB: Timestamp Log Pretty

// START SUB: Timestamp Log Plain
/* START */
function timeStampLogPlain() {
  const dateTime = require('node-datetime');
  const dt = dateTime.create();
  return `${dt.format('Y-m-d H:M:S')}| `;
}
/* END */
// END SUB: Timestamp Log Plain

// START SUB: Timestamp Normal
/* START */
function timeStamp() {
  const dateTime = require('node-datetime');
  const dt = dateTime.create();
  return dt.format('Y-m-d H:M:S');
}
/* END */
// END SUB: Timestamp Normal

// START SUB: Ping
/* START */
function ping(host) {
  const spawn = require('child_process').spawn;
  const readline = require('readline');
  if (systemOS === 'win32') {
    command = spawn('ping', ['-n', '5', host]);
    readline.createInterface({
      input: command.stdout,
      terminal: false,
    }).on('line', (line) => {
      console.log(line);
    });
    command.on('data', (data) => {
      console.log(err);
    });
    command.on('exit', (data) => {
      botConsole();
    });
  } else if (systemOS === 'linux') {
    command = spawn('ping', ['-c', '5', host]);
    readline.createInterface({
      input: command.stdout,
      terminal: true,
    }).on('line', (line) => {
      console.log(line);
    });
    command.on('data', (data) => {
      console.log(err);
    });
    command.on('exit', (data) => {
      botConsole();
    });
  }
}
/* END */
// END SUB: Ping

// START SUB: Git Operations
/* START */
function git(argument) {
  const sys = require('util');
  const exec = require('child_process').exec;
  function puts(error, stdout, stderr) {
    console.log(stdout);
    botConsole();
  }
  if (argument === 'HISTORY') {
    if (systemOS === 'win32') {
      exec('git log --pretty=format:"%h - %an (%ae): %s" --shortstat  -n 3', puts);
    } else {
      exec('git log --pretty=format:"%h - %an (%ae): %s" --shortstat  -n 3', puts);
    }
  } else if (argument === 'PULL') {
    if (systemOS === 'win32') {
      exec('git stash && git pull', puts);
    } else {
      exec('git stash; git pull', puts);
    }
  } else {
    console.log(timeStampLog() + 'Usage: git history/pull'.bold.green);
    botConsole();
  }
}
/* END */
// END SUB: Git Operations


// START SUB: Update Routine
/* START */
function update() {
  const sys = require('util');
  const exec = require('child_process').exec;
  function puts(error, stdout, stderr) {
    console.log(stdout);
    if (error) {
      console.log(`ERROR:${error}`);
      console.log('Update was not successful!'.red);
    } else {
      console.log('Update was successful!'.green);
    }
    botConsole();
  }
  if (systemOS === 'win32') {
    exec('git stash & git pull & npm update', puts);
  } else {
    exec('git stash ; git pull ; sudo npm update', puts);
  }
}
/* END */
// END SUB: Update Routine

// START SUB: Config Operations
/* START */
function config(argument) {
  const sys = require('util');
  const exec = require('child_process').exec;
  const config = `${__dirname}/config/config.json`;
  const configBackup = `${__dirname}/config/config.json.backup`;
  function puts(error, stdout, stderr) {
    console.log(stdout);
    botConsole();
  }
  if (argument === 'SHOW') {
    fs.readFile(`${__dirname}/config/config.json`, 'utf8', (err, data) => {
      if (err) {
        console.log(timeStampLog() + err);
      }
      console.log(data);
      botConsole();
    });
  } else if (argument === 'BACKUP') {
    fs.readFile(config, 'utf8', (err, data) => {
      if (err) {
        return console.log(timeStampLog() + err);
      }
      fs.writeFile(configBackup, data, 'utf8', (err) => {
        if (err) return console.log(timeStampLog() + err);
        console.log(timeStampLog()
          + 'Backup saved to config/config.json.backup!'.bold.green);
        botConsole();
      });
    });
  } else if (argument === 'WIPE') {
    fs.unlinkSync(`${__dirname}/config/config.json`, 'utf8', (err, data) => {
      if (err) {
        console.log(timeStampLog() + err);
      }
    });
    console.log(timeStampLog() + 'Sucessfully wiped the config, exiting the program!'.bold.red);
    process.exit();
  } else {
    console.log(timeStampLog() + 'Usage: config show/backup/wipe'.bold.green);
    botConsole();
  }
}
/* END */
// END SUB: Config Operations

// START SUB: Blessed Example
/* START */
function doSomething() {
  const screen = blessed.screen({
    tput: true,
    smartCSR: true,
    dump: `${__dirname}/logs/prompt.log`,
    autoPadding: true,
    warnings: true,
  });
  const prompt = blessed.prompt({
    parent: screen,
    border: 'line',
    height: 'shrink',
    width: 'half',
    top: 'center',
    left: 'center',
    label: ' {blue-fg}Prompt{/blue-fg} ',
    tags: true,
    keys: true,
    vi: true,
  });
  const question = blessed.question({
    parent: screen,
    border: 'line',
    height: 'shrink',
    width: 'half',
    top: 'center',
    left: 'center',
    label: ' {blue-fg}Question{/blue-fg} ',
    tags: true,
    keys: true,
    vi: true,
  });
  const msg = blessed.message({
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
    vi: true,
  });
  const loader = blessed.loading({
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
    vi: true,
  });
  prompt.input('Question?', '', (err, value) => {
    question.ask('Question?', (err, value) => {
      msg.display('Hello world!', 3, (err) => {
        msg.display('Hello world again!', -1, (err) => {
          loader.load('Loading...');
          setTimeout(() => {
            loader.stop();
            screen.destroy();
            botConsole();
          }, 3000);
        });
      });
    });
  });
  screen.key('q', () => {
    screen.destroy();
    botConsole();
  });
  screen.render();
}
/* END */
// END SUB: BLESSED EXAMPLE

// START SUB: Prompt
/* START */
function prompt(question, callback) {
  const stdin = process.stdin;
  const stdout = process.stdout;
  stdin.resume();
  stdout.write(question);
  stdin.once('data', (data) => {
    callback(data.toString().trim());
  });
}
/* END */
// END SUB: Prompt

// START SUB: Updates a Cloudflare Record
/* START */
function updateCloudFlare() {
  cloudflareddns({
    email: conf.cloudflare_email,
    key: conf.cloudflare_api_key,
    domain: conf.cloudflare_domain,
    subdomain: conf.cloudflare_records,
  }).then(
    ip => console.fileLog(`Updated ${conf.cloudflare_records} to ${ip}`, log_file_cloudflare),
    reason => console.fileLog(reason, log_file_cloudflare),
  );
}
/* END */
// END SUB: Updates a Cloudflare Record

// START SUB: Service Status Line
/* START */
function getStatusLine() {
  let statusDSELF = true;
  let statusDBOT = true;
  let statusWEB = true;
  let statusDBOX = true;
  let statusDB = true;
  if (statusDSELF) {
    statusDSELF = '✓ '.bold.green + 'DSELF'.gray;
  } else {
    statusDSELF = '✗ '.bold.red + 'DSELF'.gray;
  }
  if (statusDBOT) {
    statusDBOT = '✓ '.bold.green + 'DBOT'.gray;
  } else {
    statusDBOT = '✗ '.bold.red + 'DBOT'.gray;
  }
  if (statusWEB) {
    statusWEB = '✓ '.bold.green + 'WEB'.gray;
  } else {
    statusWEB = '✗ '.bold.red + 'WEB'.gray;
  }
  if (conf.dropbox_token) {
    statusDBOX = '✓ '.bold.green + 'DBOX'.gray;
  } else {
    statusDBOX = '✗ '.bold.red + 'DBOX'.gray;
  }
  if (statusDB) {
    statusDB = '✓ '.bold.green + 'DB'.gray;
  } else {
    statusDB = '✗ '.bold.red + 'DB'.gray;
  }
  return `${statusDSELF} ${statusDBOT} ${statusWEB} ${statusDBOX} ${statusDB}`;
}
/* END */
// END SUB: Service Status Line

// START SUB: Console Prompt
/* START */
function botConsolePrompt() {
  if (!conf.host_ip) { var host = 'localhost'; } else { var host = conf.host_ip; }
  const prompt = conf.bot_nickname.toLowerCase().yellow + '@'.yellow + host.yellow + ' >>\ '.trap.bold.cyan;
  return prompt;
}
/* END */
// END SUB: Console Prompt

// START SUB: Discord Bot Controller
/* START */
function botDiscord(type, operation) {
  if (operation === 'START') {
    if (type === 'SELF') {
      token = conf.discord_token_self;
    } else if (type === 'BOT') {
      token = conf.discord_token_bot;
    }
    client = new Client();
    client.on('ready', () => {
      // console.log(timeStampLog()+"Discord "+type+" is ready for you!");
      // ee.emit('botConsole');
    });
    client.on('message', (msg) => {
      fs.appendFile('logs/discord.log', `${msg.content}\n`, 'utf8', (err) => {
      });
    });
    client.login(token);
    var msg = `Discord ${type.toLowerCase()} started successfully!`;
    console.log(timeStampLog() + msg.green);
    botConsole();
  } else if (operation === 'STOP') {
    var msg = `Discord ${type.toLowerCase()} stopped successfully!`;
    client.destroy();
    console.log(timeStampLog() + msg.red);
    botConsole();
  }
}
/* END */
// END SUB: Discord Bot Controller

// START SUB: Console
/* START */
function botConsole() {
  if (fs.existsSync(`${__dirname}/config/config.json`)) {
    prompt(timeStampLog() + botConsolePrompt(), (botCommand) => {
      const args = botCommand.split(/(\s+)/);
      if (args[0].toUpperCase() === 'EXIT') {
        console.log(`${timeStampLog()}Exiting back to console...`);
        process.exit();
      } else if (args[0].toUpperCase() === 'WEB') {
        webServer(args[2].toUpperCase());
      } else if (args[0].toUpperCase() === 'DISCORD') {
        botDiscord(args[2].toUpperCase(), args[4].toUpperCase());
      } else if (args[0].toUpperCase() === 'DROPBOX') {
        dropboxAPI(args[2].toUpperCase(), args);
      } else if (args[0].toUpperCase() === 'CONFIG') {
        config(args[2].toUpperCase());
      } else if (args[0].toUpperCase() === 'PING') {
        const host = args[2].toUpperCase();
        ping(host);
      } else if (args[0].toUpperCase() === 'GIT') {
        console.log(`${timeStampLog()}Working with repository, please wait...`);
        const argument = args[2];
        git(argument.toUpperCase());
      } else if (args[0].toUpperCase() === 'UPDATE') {
        console.log(`${timeStampLog()}Updating ${conf.bot_nickname}, please wait...`);
        const argument = args[2];
        update();
      } else if (args[0].toUpperCase() === 'DOCS') {
        generateDocumentation();
      } else if (args[0].toUpperCase() === 'DO') {
        doSomething();
      } else if (args[0] === '' || !args[0]) {
        console.log(timeStampLog() + 'Need to enter a command...'.yellow);
        botConsole();
      } else {
        const sys = require('util');
        const exec = require('child_process').exec;
        function puts(error, stdout, stderr) {
          console.log(stdout);
          botConsole();
        }
        if (conf.bot_shell_whitelist.indexOf(args[0].toLowerCase()) != -1) {
          exec(botCommand, puts);
        } else {
          console.log(`${timeStampLog()}This command is blacklisted!`);
          botConsole();
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
  if (action === 'START') {
    var webBackendStatus = `http:\/\/localhost:${conf.bot_port_web}/api/${conf.bot_api_key}/status`;
    request({
      url: webBackendStatus,
      timeout: 1000,
    }, (error, response, body) => {
      if (!error) {
        console.log(timeStampLog() + 'Web Server already started!'.yellow);
        botConsole();
      } else {
        const privateKey = fs.readFileSync(`${__dirname}/assets/ssl/privatekey.pem`, 'utf8');
        const certificate = fs.readFileSync(`${__dirname}/assets/ssl/certificate.pem`, 'utf8');

        const credentials = { key: privateKey, cert: certificate };
        const web = express();

        const httpServer = http.createServer(web);
        const httpsServer = https.createServer(credentials, web);

        httpServer.listen(80);
        httpsServer.listen(443);

        web.use(express.static(path.join(__dirname, 'assets/web/public')));
        web.set('views', path.join(__dirname, 'assets/web/views'));
        web.set('view engine', 'ejs');
        web.get('/', (req, res) => res.render('pages/index', {
          web_title: conf.web_title,
          web_favicon: conf.web_favicon,
          bot_nickname: conf.bot_nickname,
          bot_logo_long: conf.bot_logo_long,
          bot_logo_square: conf.bot_logo_square,
          bot_info_website: conf.bot_info_website,
          bot_info_copyright: conf.bot_info_copyright,
          discord_invite_link: conf.discord_invite_link,
          theme: 'cyborg',
        }));
        web.get(`/api/${conf.bot_api_key}/close`, (req, res) => {
          res.send('Stopping the web server...');
          server.close();
        });
        web.get(`/api/${conf.bot_api_key}/status`, (req, res) => {
          res.send('Web server IS online...');
        });
        web.get(`/api/${conf.bot_api_key}/close`, (req, res) => {
          res.send('Stopping the web server...');
          server.close();
        });
        web.get(`/api/${conf.bot_api_key}/info/system`, (req, res) => {
          res.send(conf);
        });
        console.log(timeStampLog() + 'Web server started successfully!'.green);
        console.log(path.join(__dirname, 'assets/web/public'));
        botConsole();
      }
    });
  } else if (action === 'STOP') {
    const webBackendClose = `http:\/\/localhost:${conf.bot_port_web}/api/${conf.bot_api_key}/close`;
    var webBackendStatus = `http:\/\/localhost:${conf.bot_port_web}/api/${conf.bot_api_key}/status`;
    request({
      url: webBackendClose,
      // timeout: 500
    }, (error, response, body) => {
      console.log(timeStampLog() + 'Web server stopped successfully!'.red);
      botConsole();
    });
  } else if (action === 'STATUS') {
    var webBackendStatus = `http:\/\/localhost:${conf.bot_port_web}/api/${conf.bot_api_key}/status`;
    request({
      url: webBackendStatus,
      timeout: 1000,
    }, (error, response, body) => {
      if (error) {
        console.log(timeStampLog() + 'Web Server IS NOT online...'.red);
      } else {
        console.log(timeStampLog() + 'Web Server IS online...'.green);
      }
      botConsole();
    });
  }
}
/* END */
// END SUB: Web Server

// START SUB: Dropbox API
/* START */
function dropboxAPI(command, argument) {
  if (command === 'ACCOUNT') {
    console.log(`${timeStampLog()}Querying DropBox account information, please wait...`);
    dropbox.account((err, res, body) => {
      if (!err) {
        console.log(body);
        botConsole();
      } else {
        console.log(timeStampLog() + err);
        botConsole();
      }
    });
  }
  if (command === 'PUT') {
    console.log(`${timeStampLog()}Testing Dropbox upload...`);
    fs.readFile(`${__dirname}/${argument[4]}`, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      dropbox.createFile(argument[4], data, (err, res, body) => {
        if (!err) {
          const result = JSON.parse(body);
          console.log(`Name: ${result.name}`);
          console.log(`Path Lower: ${result.path_lower}`);
          console.log(`Path Display: ${result.path_display}`);
          console.log(`Identifier: ${result.id}`);
          console.log(`Client Modified: ${result.client_modified}`);
          console.log(`Server Modified: ${result.server_modified}`);
          console.log(`Rev: ${result.rev}`);
          console.log(`Size: ${result.size}`);
          console.log(`Content Hash: ${result.content_hash}`);
          console.log(timeStampLog() + 'Sucessfully wrote '.green + argument[4].green + ' to DropBox!'.green);
          botConsole();
        } else if (err) {
          console.log(timeStampLog() + err);
          botConsole();
        }
      });
    });
  }
  if (command === 'GET') {
    console.log(`${timeStampLog()}Testing Dropbox download...`);
    dropbox.getFile(argument[4], (err, res, body) => {
      if (!err) {
        fs.writeFile(argument[6], body, 'utf8', (err) => {
          if (err) return console.log(timeStampLog() + err);
          console.log(timeStampLog() + 'Sucessfully wrote '.green + argument[4].green + ' to DropBox!'.green);
          botConsole();
        });
      } else if (err) {
        console.log(timeStampLog() + err);
        botConsole();
      }
    });
  }
}
/* END */
// END SUB: Dropbox API

// START SUB: Peers List Wipe
/* START */
function peersWipe() {
  fs.writeFile('config/peers.json', '{}', { ecoding: 'utf8' }, (err) => {
    if (err) return console.log(timeStampLog() + err);
  });
}
/* END */
// END SUB: Peers List Wipe

// START SUB: Peers List Get
/* START */
function peersGet() {
  dropbox.getFile('controller/peers.json', (err, res, body) => {
    if (!err) {
      fs.writeFile('config/peers.json', body, { ecoding: 'utf8' }, (err) => {
        if (err) return console.log(timeStampLog() + err);
      });
    } else if (err) {
    }
  });
}
/* END */
// END SUB: Peer List Get

// START SUB: Peers List Get
/* START */
function peersUpdate() {
  http.get('http://bot.whatismyipaddress.com', (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      MongoClient.connect(conf.mongodb_uri, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        const dbo = db.db(conf.mongodb_dbname);
        const fileNameConfig = `${__dirname}/config/config.json`;
        const fileConfig = require(fileNameConfig);
        const lookup = { host_ip: chunk };
        const peerUpdateInfo = { $set: fileConfig };
        const timeStamp = +new Date();
        dbo.collection('peers').updateOne(lookup, peerUpdateInfo, { upsert: true, safe: false }, (err, res) => {
          if (err) throw err;
        });
        dbo.collection('peers').updateOne(lookup, { $set: { host_last_updated: timeStamp } }, { upsert: true, safe: false }, (err, res) => {
          if (err) throw err;
        });
	  });
    });
  });
}
// old dropbox method
// fs.readFile('config/peers.json', 'utf8', (err, data) => {
//   if (err) {
//     return console.log(err);
//   }
//   dropbox.createFile('controller/peers.json', data, (err, res, body) => {
//     if (!err) {
//     } else if(err) {
//     }
//   });
// });
/* END */
// END SUB: Peer List Get

// START SUB: Documentation Generator
/* START */
function generateDocumentation() {
  console.log(timeStampLog() + 'Documentation generation beginning, please wait...'.yellow);
  fs.readFile(`${__dirname}/init.js`, 'ascii', (err, data) => {
    if (err) {
      return console.log(timeStampLog() + err);
    }
    const result = data
      .replace(/#!\/usr\/bin\/env node/g,
        '# Documentation')
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
    fs.writeFile(`${__dirname}/docs/DOCS.md`, result, 'ascii', (err) => {
      if (err) {
		  return console.log(timeStampLog() + err);
      }
      if (fs.existsSync(`${__dirname}/docs/DOCS.md`)) {
        fs.readFile(`${__dirname}/docs/DOCS.md`, 'ascii', (err, data) => {
          if (err) {
					  return console.log(timeStampLog() + err);
          }
					  const showdown = require('showdown');


          const converter = new showdown.Converter();


          const text = '# hello, markdown!';


          const html = converter.makeHtml(data);
					  fs.writeFile(`${__dirname}/docs/DOCS.html`, html, 'ascii', (err) => {
            if (err) {
              return console.log(timeStampLog() + err);
            }
            const docStyle = `
		<style>
		body {
			background-color:#ffffff;color:#000;padding:5px;
		}
		pre {
			border:1px solid gray;
			background-color:#f8f8ff;
			box-shadow:inset 0px 0px 0px 2px #D3D3D3;
			padding:2px;color:black;font-family: 'Lucida Console';
			font-size:.8em;
		}
		</style>`;
            const docStyle2 = `
                <meta charset="utf-8"/>
                <style>
                @import url("https://raw.githubusercontent.com/nodefried/nodefried/master/assets/web/public/stylesheets/github-markdown.css");
                </style>`;
            const data = fs.readFileSync(`${__dirname}/docs/DOCS.html`);
            const fd = fs.openSync(`${__dirname}/docs/DOCS.html`, 'w+');
            const insert = new Buffer(docStyle2);
            fs.writeSync(fd, insert, 0, 'ascii', insert.length, 0);
            fs.writeSync(fd, data, 0, 'ascii', data.length, insert.length);
            fs.close(fd, (err) => {
							  if (err) throw err;
            });
            // fs.prependFile(`${__dirname}/docs/DOCS.html`, docStyle2, function (err) {
            //	if (err) throw err;
            // });
	  });
        });
      }
    });
    console.log(timeStampLog() + 'Documentation generation done!'.bold.green);
    botConsole();
  });
}
/* END */
// END SUB: Main Generator

// END SECTION: FUNCTIONS

// START SECTION: RUNTIME

// START SUB: Cron Jobs
/* START */
function peersUpdateCron(callback) {
  setInterval(() => {
    console.fileLog('Peers Synchronized Sucessfully!', log_file_peers);
    peersUpdate();
    callback(null, 'finished!');
  }, 20000);
}
function testCron(callback) {
  setInterval(() => {
    console.fileLog('Peer Status Updated Sucessfully!', log_file_peers);
    // peersUpdate();
    callback(null, 'finished!');
  }, 10000);
}
function cloudflareCron(callback) {
  setInterval(() => {
    // this one made it into actual logging no need to console.fileLog
    // also, we only update this if we are the master node, and web server is online...
    if (conf.bot_mode === 'master') {
      updateCloudFlare();
    }
    callback(null, 'finished!');
  }, 60000);
}
function cron() {
  // console.log('started');
  peersUpdateCron((err, result) => result);
  testCron((err, result) => result);
  cloudflareCron((err, result) => result);
}
cron();
/* END */
// END SUB: Cron Jobs

// START SUB: Initial Prompt and Console
// COMMENT: Calls the console, which everything else calls back too... kinda.
/* START */
botConsole();
/* END */
// END SUB: Initial Prompt and Console

// END SECTION: RUNTIME
