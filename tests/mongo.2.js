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
var host_ip = '0.0.0.0'

function peersOnline(callbackPeersOnline){
  MongoClient.connect(provision.mongodb_uri,{useNewUrlParser:true},function(err,db){
    var dbo=db.db(database)
    dbo.collection('peers', function(err, collection) {
      collection.find({host_status:'online'}).forEach(function(err, doc) {
        if(err){
          callbackPeersOnline(err)
        }else{
          callbackPeersOnline(doc)
        }
      })
    })
  })
}
peersOnline(function(resultPeersOnline){
  console.log(resultPeersOnline)  
})