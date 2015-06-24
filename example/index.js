var express = require('express');
var connectVersion = require('../index');

var app = express();

var options = {
  versions: {
    '2.0.0-beta.1': require('./routes/2.0.0-beta.1'),
    '1.2.3': require('./routes/1.2.3')
  },
  match: 'Content-Type' // this is the default matcher
};

app.use(connectVersion(options));

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.error("Express server listening on port %d", port);
});