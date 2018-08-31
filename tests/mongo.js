var db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    assert = require('assert');
//need to be config value
var uri = "";

MongoClient.connect(uri, function(err, db) {
    //if error do nothing
    if (err) throw err;
    //set db
    var dbo = db.db("");

    //create empty collection
    // dbo.createCollection("peers", function(err, res) {
    //   if (err) throw err;
    //   console.log("Collection created!");
    //   db.close();
    // });

    //update record
    // var lookup = { peer: "x.x.x.x" };
    // var peerUpdateInfo = { $set: {peer: "x.x.x.x", peer_config: [{ "bot_nickname": "Nodefried", "test": "test"}] } };
    // dbo.collection("peers").updateOne(lookup, peerUpdateInfo, function(err, res) {
    //     if (err) throw err;
    //     console.log("1 peer updated!");
    //     db.close();
    // });  

    //create record
    // var peerInfo = { peer: "x.x.x.x", peer_config: [{ "bot_nickname": "Nodefried", "test": "test"}] };
    // dbo.collection("peers").insertOne(peerInfo, function(err, res) {
    //     if (err) throw err;
    //     console.log("1 peer inserted!");
    //     db.close();
    // }); 
   
});