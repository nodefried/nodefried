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
var dbo=db.db(database)

dbo.collection("peers").updateOne("{host_ip:{$ne:'64.137.188.115'}}","{bot_mode:'slave'}",{upsert:true,safe:false},function(err,res){
  console.log(res)
})