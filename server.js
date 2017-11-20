var express = require('express');
var mongoose =require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var routerapi = require('./api/userRouting');
var port = 3000;
var path = require('path');

mongoose.connect('mongodb://127.0.0.1:27017/Profile');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'uploads')));
// headers and content type

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

    app.use('/api', routerapi);

var server = app.listen(port, function () {
  console.log("Listening on port %s...", port);
});