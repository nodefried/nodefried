const colors=require('colors')
const fs=require('fs')
const http=require('http')
const template=require('..//config//template.json')
const MongoClient=require('mongodb').MongoClient
const mongoURI=template.mongodb_uri
const database=mongoURI.split(/\/+/).pop()
const assert=require('assert')
const mkdirp=require('mkdirp')
var config
function databaseTemplate(callback){
  callback('Checking database URI and testing connection...'.yellow)
  MongoClient.connect(template.mongodb_uri,{useNewUrlParser:true},function(err,db){
    if(err){callback('Could not connect to database: '+err.red)}
    var dbo=db.db(database)
    callback('Found database '.green+database+', checking for template file...'.green)
    dbo.collection('peers').findOne({_id:'template'},function(err,config){ 
      if(config){
        callback(`Found master template in database.\n`.green+
        `Using database template to configure this node...`.green)
        http.get('http://bot.whatismyipaddress.com',function(res){
          res.setEncoding('utf8')
          res.on('data',function(chunk){
            var host
            var isWin=/^win/.test(process.platform)
            var isDarwin=/^darwin/.test(process.platform)
            if(isWin){host="win32"}else if(isDarwin){host="osx"}else{host="linux"}
            var timeStamp=+new Date()
            config.host_ip=chunk
            config.host_os=host
            config.host_last_updated=timeStamp
            config.host_status='online'
            delete config['_id']
            var lookup = { host_ip: config.host_ip }
            var updateInfo={$set:config}
            dbo.collection("peers").updateOne(lookup,updateInfo,{upsert:true,safe:false},function(err,res){
              if(err){throw err}else{console.log('Updated peer sucessfully...')}
              //main code here
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
              module.exports = {
                bot_nickname: config.bot_nickname,
                bot_api_key: config.bot_api_key,
                bot_port_web: config.bot_port_web,
                bot_logo_long: config.bot_logo_long,
                bot_logo_square: config.bot_logo_square,
                bot_info_website: config.bot_info_website,
                bot_info_copyright: config.bot_info_copyright,
                bot_shell_whitelist: config.bot_shell_whitelist,
                bot_motd_disable: config.bot_motd_disable,
                bot_mode: config.bot_mode,
                discord_token_bot: config.discord_token_bot,
                discord_token_self: config.discord_token_self,
                web_title: config.web_title,
                web_favicon: config.web_favicon,
                dropbox_token: config.dropbox_token,
                cloudflare_email: config.cloudflare_email,
                cloudflare_api_key: config.cloudflare_api_key,
                cloudflare_domain: config.cloudflare_domain,
                cloudflare_records: config.cloudflare_records,
                host_ip: config.host_ip,
                host_os: config.host_os,
                host_status: config.host_status,
                host_last_updated: config.host_last_updated,
                mongodb_uri: config.mongodb_uri,
                mongodb_dbname: config.mongodb_dbname
              }
              //main code here
            })
          })
        })
      }else{
        callback(`Template doesn't exist.\n`+
          `Uploading our config/template.json as master....`.yellow)
          var lookup={_id:'template'}
          var templateInfo={$set:template}
        dbo.collection('peers').updateOne(lookup,templateInfo,{upsert:true,safe:false}, function(err,res) {
          if(err){return callback('Problem adding template: '+err.red)}
          callback(`Master template setup completed sucessfully!\n`.green+
          `Initial configuration complete! System is ready to go!`.rainbow)
        })       
      }
    })
  })
}
function createDirectoryStructure(callback){
  mkdirp('./logs')
  mkdirp('./tmp')
  callback('Directory structure created successfully!'.green)
}
function setup(callbackSetup){
  createDirectoryStructure(function(resultDirectoryStructure){callbackSetup(resultDirectoryStructure)})
  databaseTemplate(function(resultDatabaseTemplate){callbackSetup(resultDatabaseTemplate)})
}
setup(function(resultSetup){console.log(resultSetup)})

