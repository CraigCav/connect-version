var express = require('express');
var app = module.exports = express();

// normal routes defintions
app.get('/', function(req, res) {
  res.send('Hello from version 1.2.3!');
});