var express = require('express');
var app = module.exports = express();

// middleware that only applies to this version of the API
app.use(function(req, res, next) {
  console.log('Woah, this user is on the bleeding edge!');
  next();
});

// normal routes defintions
app.get('/', function(req, res) {
  res.send('Hello from version 2.0.0-beta.1!');
});