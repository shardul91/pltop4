//import express package
var express = require("express");

//import mongodb package
var mongodb = require("mongodb");

//MongoDB connection URL - mongodb://host:port/dbName
var dbHost = "mongodb://localhost:27017/Premier_League_db";

//DB Object
var dbObject;

//get instance of MongoClient to establish connection
var MongoClient = mongodb.MongoClient;

//Connecting to the Mongodb instance.
//Make sure your mongodb daemon mongod is running on port 27017 on localhost
MongoClient.connect(dbHost, function(err, db){
  if ( err ) throw err;
  dbObject = db;
});

function getData(responseObj){
  //use the find() API and pass an empty query object to retrieve all records
  dbObject.collection("Premier_League_Standings").find({}).toArray(function(err, docs){
    if ( err ) throw err;
    var monthArray = [];
    var LeicesterArr = [];
    var TottenhamArr = [];
    var ArsenalArr = [];
    var Manchester_CityArr = [];
    var Points = [];

    for ( index in docs){
      var doc = docs[index];
      //category array
      var month = doc['month'];
      var Leicester_City = doc['Leicester City'];
      var Tottenham = doc['Tottenham'];
      var Arsenal = doc['Arsenal'];
      var Man_City = doc['Manchester City'];

      monthArray.push({"label": month});
      LeicesterArr.push({"value" : Leicester_City});
      TottenhamArr.push({"value" : Tottenham});
      ArsenalArr.push({"value" : Arsenal});
      Manchester_CityArr.push({"value" : Man_City});
    }

    var dataset = [
      {
        "seriesname" : "Leicester",
        "data" : LeicesterArr
      },
      {
        "seriesname" : "Tottenham",
        "data": TottenhamArr
      },
      {
        "seriesname" : "Arsenal",
        "data" : ArsenalArr
      },
      {
        "seriesname" : "Manchester City",
        "data": Manchester_CityArr
      }
    ];

    var response = {
      "dataset" : dataset,
      "categories" : monthArray
    };
    responseObj.json(response);
  });
}

//create express app
var app = express();

//NPM Module to integrate Handlerbars UI template engine with Express
var exphbs  = require('express-handlebars');

//Declaring Express to use Handlerbars template engine with main.handlebars as
//the default layout
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Defining middleware to serve static files
app.use('/public', express.static('public'));
app.get("/PremierLeagueTop4", function(req, res){
  getData(res);
});
app.get("/", function(req, res){
  res.render("chart");
});

app.listen("3300", function(){
  console.log('Server up: http://localhost:3300');
});
