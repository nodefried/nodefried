const colors=require('colors')
const fs=require('fs')
const http=require('http')
const provision=require('..//fs//etc//provision.json')
const MongoClient=require('mongodb').MongoClient
const mongoURI=provision.mongodb_uri
const database=mongoURI.split(/\/+/).pop()
const assert=require('assert')
const mkdirp=require('mkdirp')
var config
MongoClient.connect(provision.mongodb_uri,{useNewUrlParser:true},function(err,db){
  var dbo=db.db(database)
  dbo.collection("peers").updateMany({host_ip:{$ne:'64.137.188.115'},_id:{$ne:'provision'}},{$set:{bot_mode:'slave'}},function(err,res){
    console.log(res)
    console.log(err)
  })
})