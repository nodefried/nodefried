//// # Constants
//// ```
const colors=require('colors')
const fs=require('fs')
const http=require('http')
const template=require(__dirname+'//fs/etc//provision.json')
const MongoClient=require('mongodb').MongoClient
const database=template.mongodb_uri.split(/\/+/).pop()
const assert=require('assert')
const mkdirp=require('mkdirp')
const exec=require('child_process').exec
const cluster=require('cluster')
const os=require('os')
const systemOS=os.platform()
const prettySize=require('prettysize')
const prettyMs=require('pretty-ms')
const path=require('path')
const express=require('express')
const request=require('request').defaults({encoding:null})
const https=require('https')
const moment=require('moment')
const {Client}=require('discord.js')
const node_dropbox=require('node-dropbox-v2')
const util=require('util')
const cloudflareddns=require('cloudflare-dynamic-dns2')
const log_file_debug=fs.createWriteStream(`${__dirname}/fs/logs/debug.log`,{flags:'w'})
const log_file_irc=fs.createWriteStream(`${__dirname}/fs/logs/irc.log`,{flags:'w'})
const log_file_discord=fs.createWriteStream(`${__dirname}/fs/logs/discord.log`,{flags:'w'})
const log_file_services=fs.createWriteStream(`${__dirname}/fs/logs/services.log`,{flags:'w'})
const log_file_peers=fs.createWriteStream(`${__dirname}/fs/logs/peers.log`,{flags:'w'})
const log_file_cloudflare=fs.createWriteStream(`${__dirname}/fs/logs/cloudflare.log`,{flags:'w'})
const log_stdout=process.stdout
var config
//// ```
//// # Main Thread
//// ```
MongoClient.connect(template.mongodb_uri,{useNewUrlParser:true},function(err,db){
  if(err){throw err}
  var dbo=db.db(database)
  //// ```
  //// ### Check for Provision Template in Database
  //// ```
  dbo.collection('peers').findOne({_id:'provision'},function(err,provision){
  //// ```
    //// ### Provision Data Exists, Provision the Node with it
    //// ```
    if(provision){
      http.get('http://bot.whatismyipaddress.com',function(res){
        res.setEncoding('utf8')
        res.on('data',function(host_ip){
          var host
          var isWin=/^win/.test(process.platform)
          var isDarwin=/^darwin/.test(process.platform)
          if(isWin){host="win32"}else if(isDarwin){host="osx"}else{host="linux"}
          var timeStamp=moment().unix()
          provision.host_ip=host_ip
          provision.host_os=host
          provision.host_last_updated=timeStamp
          provision.host_status='online'
          delete provision['_id']
          provision.bot_mode='master'
          var lookup={ host_ip: host_ip }
          var updateInfo={$set:provision}
          //// ```
          //// #### Update Peer Info, set Other Hosts to Slave since this is Node is Fresh
          //// ```
          dbo.collection("peers").updateOne(lookup,updateInfo,{upsert:true,safe:false},function(err,res){
            dbo.collection("peers").updateMany({host_ip:{$ne:host_ip},_id:{$ne:'provision'}},{$set:{bot_mode:'slave'}},function(err,res){
              //// ```
              //// #### Lets find our Config Now that Provisioning is Done
              /// ```
              dbo.collection("peers").findOne({host_ip:host_ip},function(err,config){
                if(err){throw err}
                //// ```
                //// #### MOTD
                //// ```
                console.log("")
                console.log("                 ."+"###".red+"`")
                console.log("                ,"+"#####".red+"`")
                console.log("                 ####".red+"+")
                console.log("                  '"+"#".gray+";")
                console.log("                  ,"+"#".gray+";")
                console.log("    '"+"#############################".gray+";")
                console.log("    ###############################".gray)
                console.log(" ,,,"+"###############################".gray+",,")
                console.log("`"+"#########`".gray+"##,".bold.blue+"'#########:".gray+"'##".bold.blue+"`#########".gray)
                console.log(":"+"########` ".gray+"##,".bold.blue+" ########+ ".gray+"+##".bold.blue+" .########".gray+".")
                console.log(":"+"########   ".gray+"`".bold.blue+"  ,#######`  ".gray+".".bold.blue+"   ########".gray+".")
                console.log(":"+"########      ,#######`      ########".gray+".")
                console.log(":"+"#########    :#########.   `#########".gray+".")
                console.log(":"+"##########++#############++##########".gray+".")
                console.log("."+"#####################################".gray)
                console.log(" ```"+"###############################".gray+"``")
                console.log("    ##############################".gray+"+")
                console.log("     `````````````````````````````".white)
                console.log('Welcome back! Type '.reset+'help'.inverse+' for commands.'.reset)
                //// ```
                //// #### Main Functions
                //// ```
                console.fileLog=function (d, file){
                  file.write(`${timeStampLogPlain() + util.format(d)}\n`)
                }
                process.on('SIGINT', () =>{
                  console.log('')
                  console.log('Received SIGINT, killing current command...')
                })
                function timeStampLog(){
                  const dateTime=require('node-datetime')
                  const dt=dateTime.create()
                  return `${dt.format('Y-m-d H:M:S').dim.magenta} | `
                }
                function timeStampLogPlain(){
                  const dateTime=require('node-datetime')
                  const dt=dateTime.create()
                  return `${dt.format('Y-m-d H:M:S')}| `
                }
                function timeStamp(){
                  const dateTime=require('node-datetime')
                  const dt=dateTime.create()
                  return dt.format('Y-m-d H:M:S')
                }
                function ping(host){
                  const spawn=require('child_process').spawn
                  const readline=require('readline')
                  if (systemOS === 'win32'){
                    command=spawn('ping', ['-n', '5', host])
                    readline.createInterface({
                      input: command.stdout,
                      terminal: false,
                    }).on('line', (line) =>{
                      console.log(line)
                    })
                    command.on('data', (data) =>{
                      console.log(err)
                    })
                    command.on('exit', (data) =>{
                      botConsole()
                    })
                  } else if (systemOS === 'linux'){
                    command=spawn('ping', ['-c', '5', host])
                    readline.createInterface({
                      input: command.stdout,
                      terminal: true,
                    }).on('line', (line) =>{
                      console.log(line)
                    })
                    command.on('data', (data) =>{
                      console.log(err)
                    })
                    command.on('exit', (data) =>{
                      botConsole()
                    })
                  }
                }
                function git(argument){
                  const sys=require('util')
                  const exec=require('child_process').exec
                  function puts(error, stdout, stderr){
                    console.log(stdout)
                    botConsole()
                  }
                  if (argument === 'HISTORY'){
                    if (systemOS === 'win32'){
                      exec('git log --pretty=format:"%h - %an (%ae): %s" --shortstat  -n 3', puts)
                    } else{
                      exec('git log --pretty=format:"%h - %an (%ae): %s" --shortstat  -n 3', puts)
                    }
                  } else if (argument === 'PULL'){
                    if (systemOS === 'win32'){
                      exec('git stash && git pull', puts)
                    } else{
                      exec('git stash; git pull', puts)
                    }
                  } else{
                    console.log(timeStampLog() + 'Usage: git history/pull'.bold.green)
                    botConsole()
                  }
                }
                function update(){
                  const sys=require('util')
                  const exec=require('child_process').exec
                  function puts(error, stdout, stderr){
                    console.log(stdout)
                    if (error){
                      console.log(`ERROR:${error}`)
                      console.log('Update was not successful!'.red)
                    } else{
                      console.log('Update was successful!'.green)
                    }
                    botConsole()
                  }
                  if (systemOS === 'win32'){
                    exec('git stash & git pull & npm update', puts)
                  } else{
                    exec('git stash ; git pull ; sudo npm update', puts)
                  }
                }
                function provision(argument){
                  const sys=require('util')
                  const exec=require('child_process').exec
                  const config=`${__dirname}/fs/etc/provision.json`
                  const configBackup=`${__dirname}/fs/etc/provision.json.backup`
                  function puts(error, stdout, stderr){
                    console.log(stdout)
                    botConsole()
                  }
                  if (argument === 'SHOW'){
                    fs.readFile(`${__dirname}/fs/etc/provision.json`, 'utf8', (err, data) =>{
                      if (err){
                        console.log(timeStampLog() + err)
                      }
                      console.log(data)
                      botConsole()
                    })
                  } else if (argument === 'BACKUP'){
                    fs.readFile(config, 'utf8', (err, data) =>{
                      if (err){
                        return console.log(timeStampLog() + err)
                      }
                      fs.writeFile(configBackup, data, 'utf8', (err) =>{
                        if (err) return console.log(timeStampLog() + err)
                        console.log(timeStampLog()
                          + 'Backup saved to fs/etc/provision.json.backup!'.bold.green)
                        botConsole()
                      })
                    })
                  } else if (argument === 'WIPE'){
                    fs.unlinkSync(`${__dirname}/fs/etc/provision.config.json`, 'utf8', (err, data) =>{
                      if (err){
                        console.log(timeStampLog() + err)
                      }
                    })
                    console.log(timeStampLog() + 'Sucessfully wiped the provision, exiting the program!'.bold.red)
                    process.exit()
                  } else{
                    console.log(timeStampLog() + 'Usage: config show/backup/wipe'.bold.green)
                    botConsole()
                  }
                }
                function prompt(question, callback){
                  const stdin=process.stdin
                  const stdout=process.stdout
                  stdin.resume()
                  stdout.write(question)
                  stdin.once('data', (data) =>{
                    callback(data.toString().trim())
                  })
                }
                function updateCloudFlare(){
                  cloudflareddns({
                    email: config.cloudflare_email,
                    key: config.cloudflare_api_key,
                    domain: config.cloudflare_domain,
                    subdomain: config.cloudflare_records,
                  }).then(
                    ip => console.fileLog(`Updated ${config.cloudflare_records} to ${ip}`, log_file_cloudflare),
                    reason => console.fileLog(reason, log_file_cloudflare),
                  )
                }
                function botConsolePrompt(){
                  if (!config.host_ip){ var host='localhost'} else{ var host=config.host_ip}
                  const prompt=config.bot_nickname.toLowerCase().yellow + '@'.yellow + host.yellow + ' >>\ '.trap.bold.cyan
                  return prompt
                }
                function botDiscord(type, operation){
                  if (operation === 'START'){
                    if (type === 'SELF'){
                      token=config.discord_token_self
                    } else if (type === 'BOT'){
                      token=config.discord_token_bot
                    }
                    client=new Client()
                    client.on('ready', () =>{
                      // console.log(timeStampLog()+"Discord "+type+" is ready for you!")
                      // ee.emit('botConsole')
                    })
                    client.on('message', (msg) =>{
                      fs.appendFile('logs/discord.log', `${msg.content}\n`, 'utf8', (err) =>{
                      })
                    })
                    client.login(token)
                    var msg=`Discord ${type.toLowerCase()} started successfully!`
                    console.log(timeStampLog() + msg.green)
                    botConsole()
                  } else if (operation === 'STOP'){
                    var msg=`Discord ${type.toLowerCase()} stopped successfully!`
                    client.destroy()
                    console.log(timeStampLog() + msg.red)
                    botConsole()
                  }
                }
                function botConsole(res){
                  if(res){console.log(res)}
                  prompt(timeStampLog()+botConsolePrompt(), (botCommand) =>{
                    const args=botCommand.split(/(\s+)/)
                    if (args[0].toUpperCase() === 'EXIT'){
                      console.log(`${timeStampLog()}Exiting back to console...`)
                      process.exit()
                    } else if (args[0].toUpperCase() === 'WEB'){
                      if(args[2].toUpperCase() === 'RESTART'){
                        webServer('STOP', function(){
                          webServer('START', function(){
                            botConsole()
                          })
                        })
                      } else{
                        webServer(args[2].toUpperCase(), function(){ botConsole()})
                      }
                    } else if (args[0].toUpperCase() === 'DISCORD'){
                      botDiscord(args[2].toUpperCase(), args[4].toUpperCase())
                    } else if (args[0].toUpperCase() === 'DROPBOX'){
                      dropboxAPI(args[2].toUpperCase(), args)
                    } else if (args[0].toUpperCase() === 'PROVISION'){
                      provision(args[2].toUpperCase())
                    } else if (args[0].toUpperCase() === 'PING'){
                      const host=args[2].toUpperCase()
                      ping(host)
                    } else if (args[0].toUpperCase() === 'GIT'){
                      console.log(`${timeStampLog()}Working with repository, please wait...`)
                      const argument=args[2]
                      git(argument.toUpperCase())
                    } else if (args[0].toUpperCase() === 'UPDATE'){
                      console.log(`${timeStampLog()}Updating ${config.bot_nickname}, please wait...`)
                      const argument=args[2]
                      update()
                    } else if (args[0].toUpperCase() === 'DOCS'){
                      generateDocumentation()
                    } else if (args[0].toUpperCase() === 'STATUS'){
                      getStatusLine(function(res){
                        //return res
                        botConsole(res)
                      })
                    } else if (args[0].toUpperCase() === 'DO'){
                      doSomething()
                    } else if (args[0] === '' || !args[0]){
                      console.log(timeStampLog() + 'Need to enter a command...'.yellow)
                      botConsole()
                    } else{
                      const sys=require('util')
                      const exec=require('child_process').exec
                      function puts(error, stdout, stderr){
                        console.log(stdout)
                        botConsole()
                      }
                      if (config.bot_shell_whitelist.indexOf(args[0].toLowerCase()) != -1){
                        exec(`${botCommand}`, puts)
                      } else{
                        console.log(`${timeStampLog()}This command is blacklisted!`)
                        botConsole()
                      }
                    }
                  })
                }
                function webServer(action,callback){
                  if (action === 'START' || action === 'AUTOSTART'){
                    var webBackendStatus=`http:\/\/localhost:${config.bot_port_web}/api/${config.bot_api_key}/status`
                    request({
                      url: webBackendStatus,
                      timeout: 1000,
                    }, (error, response, body) =>{
                      if(!error){
                        if(action==='AUTOSTART'){
                          callback('finished!')
                        }else{
                          console.log(timeStampLog()+'Web Server already started!'.yellow)
                          callback('finished!')
                        }
                      } else{
                        var ssl_cert=new Buffer.from(config.ssl_cert,'base64')
                        var ssl_key=new Buffer.from(config.ssl_key,'base64')
                        const credentials={key:ssl_key,cert:ssl_cert}
                        const web=express()        
                        const httpServer=http.createServer(web)
                        const httpsServer=https.createServer(credentials, web)
                        httpServer.listen(80)
                        httpsServer.listen(443)
                        web.use(express.static(path.join(__dirname, 'fs/web/public')))
                        web.set('views', path.join(__dirname, 'fs/web/views'))
                        web.set('view engine', 'ejs')
                        web.get('/', (req, res) => res.render('pages/index',{
                          web_title: config.web_title,
                          web_favicon: config.web_favicon,
                          bot_nickname: config.bot_nickname,
                          bot_logo_long: config.bot_logo_long,
                          bot_logo_square: config.bot_logo_square,
                          bot_info_website: config.bot_info_website,
                          bot_info_copyright: config.bot_info_copyright,
                          discord_invite_link: config.discord_invite_link,
                          theme: 'default',
                        }))
                        web.get(`/api/${config.bot_api_key}/close`, (req, res) =>{
                          res.send('Stopping the web server...')
                          httpServer.close()
                          httpsServer.close()
                        })
                        web.get(`/api/${config.bot_api_key}/status`, (req, res) =>{
                          res.send('Web server IS online...')
                        })
                        web.get(`/api/${config.bot_api_key}/close`, (req, res) =>{
                          res.send('Stopping the web server...')
                          httpServer.close()
                          httpsServer.close()
                        })
                        web.get(`/api/${config.bot_api_key}/info/system`, (req, res) =>{
                          res.send(conf)
                        })
                          if(action !==  'AUTOSTART'){
                            console.log(timeStampLog() + 'Web server started successfully!'.green)
                            console.log(path.join(__dirname, 'fs/web/public'))
                            callback('finished!')
                          }
                      }
                    })
                  } else if (action === 'STOP'){
                    const webBackendClose=`http:\/\/localhost:${config.bot_port_web}/api/${config.bot_api_key}/close`
                    var webBackendStatus=`http:\/\/localhost:${config.bot_port_web}/api/${config.bot_api_key}/status`
                    request({
                      url: webBackendClose,
                      // timeout: 500
                    }, (error, response, body) =>{
                        console.log(timeStampLog() + 'Web server stopped successfully!'.red)
                        callback('finished!')
                    })
                  } else if (action === 'STATUS'){
                    var webBackendStatus=`http:\/\/localhost:${config.bot_port_web}/api/${config.bot_api_key}/status`
                    request({
                      url: webBackendStatus,
                      timeout: 1000,
                    }, (error, response, body) =>{
                      
                      if (error){
                          console.log(timeStampLog() + 'Web Server IS NOT online...'.red)
                          callback('finished!')
                      } else{
                          console.log(timeStampLog() + 'Web Server IS online...'.green)
                          callback('finished!')
                      }
                    })
                  }
                }
                function dropboxAPI(command, argument){
                  if (command === 'ACCOUNT'){
                    console.log(`${timeStampLog()}Querying DropBox account information, please wait...`)
                      node_dropbox.api(config.dropbox_token).account((err, res, body) =>{
                      if (!err){
                        console.log(body)
                        botConsole()
                      } else{
                        console.log(timeStampLog() + err)
                        botConsole()
                      }
                    })
                  }
                  if (command === 'PUT'){
                    console.log(`${timeStampLog()}Testing Dropbox upload...`)
                    fs.readFile(`${__dirname}/${argument[4]}`, 'utf8', (err, data) =>{
                      if (err){
                        return console.log(err)
                      }
                      node_dropbox.api(config.dropbox_token).createFile(argument[4], data, (err, res, body) =>{
                        if (!err){
                          const result=JSON.parse(body)
                          console.log(`Name: ${result.name}`)
                          console.log(`Path Lower: ${result.path_lower}`)
                          console.log(`Path Display: ${result.path_display}`)
                          console.log(`Identifier: ${result.id}`)
                          console.log(`Client Modified: ${result.client_modified}`)
                          console.log(`Server Modified: ${result.server_modified}`)
                          console.log(`Rev: ${result.rev}`)
                          console.log(`Size: ${result.size}`)
                          console.log(`Content Hash: ${result.content_hash}`)
                          console.log(timeStampLog() + 'Sucessfully wrote '.green + argument[4].green + ' to DropBox!'.green)
                          botConsole()
                        } else if (err){
                          console.log(timeStampLog() + err)
                          botConsole()
                        }
                      })
                    })
                  }
                  if (command === 'GET'){
                    console.log(`${timeStampLog()}Testing Dropbox download...`)
                    node_dropbox.api(config.dropbox_token).getFile(argument[4], (err, res, body) =>{
                      if (!err){
                        fs.writeFile(argument[6], body, 'utf8', (err) =>{
                          if (err) return console.log(timeStampLog() + err)
                          console.log(timeStampLog() + 'Sucessfully wrote '.green + argument[4].green + ' to DropBox!'.green)
                          botConsole()
                        })
                      } else if (err){
                        console.log(timeStampLog() + err)
                        botConsole()
                      }
                    })
                  }
                }
                function generateDocumentation(){
                  console.log(timeStampLog() + 'Documentation generation beginning, please wait...'.yellow)
                  fs.readFile(`${__dirname}/init.js`, 'ascii', (err, data) =>{
                    if (err){
                      return console.log(timeStampLog() + err)
                    }
                    const result=data
                      .replace(/#!\/usr\/bin\/env node/g,
                        '# Documentation')
                      .replace(/\/\/\/\/ /g,
                        '')
                    fs.writeFile(`${__dirname}/fs/docs/DOCS.md`, result, 'ascii', (err) =>{
                      if (err){
                      return console.log(timeStampLog() + err)
                      }
                      if (fs.existsSync(`${__dirname}/fs/docs/DOCS.md`)){
                        fs.readFile(`${__dirname}/fs/docs/DOCS.md`, 'ascii', (err, data) =>{
                          if (err){
                            return console.log(timeStampLog() + err)
                          }
                          const showdown=require('showdown')
                          const converter=new showdown.Converter()
                          const text='# hello, markdown!'
                          const html=converter.makeHtml(data)
                          fs.writeFile(`${__dirname}/fs/docs/DOCS.html`, html, 'ascii', (err) =>{
                            if (err){
                              return console.log(timeStampLog() + err)
                            }
                            const docStyle=`
                              <style>
                              body{
                                background-color:#ffffffcolor:#000padding:5px
                              }
                              pre{
                                border:1px solid gray
                                background-color:#f8f8ff
                                box-shadow:inset 0px 0px 0px 2px #D3D3D3
                                padding:2pxcolor:blackfont-family: 'Lucida Console'
                                font-size:.8em
                              }
                              </style>`
                            const docStyle2=`
                                <meta charset="utf-8"/>
                                <style>
                                @import url("https://raw.githubusercontent.com/nodefried/nodefried/master/fs/web/public/stylesheets/github-markdown.css")
                                </style>`
                            const data=fs.readFileSync(`${__dirname}/fs/docs/DOCS.html`)
                            const fd=fs.openSync(`${__dirname}/fs/docs/DOCS.html`, 'w+')
                            const insert=new Buffer(docStyle2)
                            fs.writeSync(fd, insert, 0, 'ascii', insert.length, 0)
                            fs.writeSync(fd, data, 0, 'ascii', data.length, insert.length)
                            fs.close(fd, (err) =>{
                                if (err) throw err
                            })
                          })
                        })
                      }
                    })
                    console.log(timeStampLog() + 'Documentation generation done!'.bold.green)
                    botConsole()
                  })
                }
                function getStatusLine(callback){
                  var statusWEB='✓ '.bold.green + 'WEB'.gray
                  var statusDSELF='✗ '.bold.red + 'DSELF'.gray
                  var statusDBOT='✗ '.bold.red + 'DBOT'.gray
                  var statusDB='✗ '.bold.red + 'DB'.gray
                  var statusDBOX='✗ '.bold.red + 'DBOX'.gray  
                  request('http://localhost/', function (error, response, body){
                    if (!error && response.statusCode == 200){
                      statusWEB='✓ '.bold.green + 'WEB'.gray
                    } else{
                      statusWEB='✗ '.bold.red + 'WEB'.gray
                    }
                  })
                  callback(statusDSELF+' '+statusDBOT+' '+statusWEB+' '+statusDBOX+' '+statusDB)
                  return statusDSELF+' '+statusDBOT+' '+statusWEB+' '+statusDBOX+' '+statusDB
                }
                function peersUpdate(){
                  http.get('http://bot.whatismyipaddress.com',(res)=>{
                    res.setEncoding('utf8')
                    res.on('data',(chunk)=>{
                      MongoClient.connect(provision.mongodb_uri,{useNewUrlParser:true},function(err,db){
                        dbo.collection('peers').findOne({host_ip:chunk},function(err,config){ 
                          if(err){throw err}
                          var timeStamp=moment().unix()
                          var lookup={host_ip:chunk}
                          config.host_last_updated=timeStamp
                          var peerUpdateInfo={$set:config}
                          dbo.collection("peers").updateOne(lookup,peerUpdateInfo,{upsert:true,safe:false},function(err,res){
                            if(err){throw err}
                          })    
                        })
                      })
                    })
                  })
                }
                function peersUpdateCron(callback){
                  setInterval(()=>{
                    console.fileLog('Peers Synchronized Sucessfully!',log_file_peers)
                    peersUpdate()
                    callback(null,'finished!')
                  },20000)
                }
                function testCron(callback){
                  setInterval(()=>{
                    console.fileLog('Peer Status Updated Sucessfully!',log_file_peers)
                    callback(null,'finished!')
                  },10000)
                }
                function cloudflareCron(callback){
                  setInterval(() =>{
                    if (config.bot_mode==='master'){
                      updateCloudFlare()
                    }
                    callback(null,'finished!')
                  },30000)
                }
                function cron(){
                  updateCloudFlare()
                  peersUpdateCron((err,result)=>result)
                  testCron((err,result)=>result)
                  cloudflareCron((err,result)=>result)
                }
                //// ```
                //// ### Main Start, Console
                //// ```
                cron()          
                webServer('AUTOSTART',function(){})
                botConsole()                           
              })
            })
          })
        })
      })
      //// ```
    //// ### No Provision Template in Database, First Run of Network
    //// ```
    }else{
      //// #### Add our Provision Template as DB Provision Template
      //// ```
      var lookup={_id:'provision'}
      var provisionInfo={$set:template}
      dbo.collection('peers').updateOne(lookup,provisionInfo,{upsert:true,safe:false},function(err,res){
        if(err){throw err}else{
          //// #### Success, Quit
          //// ```
          console.log('Initial provisioning completed sucessfully, restart required!'.rainbow)
          process.exit()
          //// ```
        }
      })
      //// ```
    }
  })
})
//// ```