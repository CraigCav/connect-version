# [connect-version](https://github.com/CraigCav/connect-version)

## Getting Started

```sh
$ npm install connect-version
```

## API
```js
var connectVersion = require('connect-version');
```
The `connectVersion` object is a factory function to create middleware enabling
multiple versions of an application to be hosted by a single connect server.

## Example
### varying application/API version by Content-Type (in express/connect)
This example demonstrates using content type negotiation to return a 
different response body based on what version the client whats to accept.
The server lists it's supported versions via the `options` parameter and will
use [semantic versioning](https://github.com/npm/node-semver) to find an appropriate match for the client's request.

```js
// server.js
var express = require('express');
var connectVersion = require('connect-version');

var app = express();

var options = {
  versions: {
    '2.0.0-beta.1': require('./routes/2.0.0-beta.1'),
    '1.2.3': require('./routes/1.2.3')
  },
  match: 'Content-Type' // this is the default matcher
};

app.use(connectVersion(options));

```
```js
// routes/1.2.3/index.js
var express = require('express');
var app = module.exports = express();

// normal routes defintions
app.get('/', function(req, res) {
  res.send('Hello from version 1.2.3!');
});

```
```js
// routes/2.0.0-beta.1/index.js
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

```
Example Request:
```
GET / HTTP/1.1
Host: example.com
Accept: application/vnd.com.myservice+text;version=1.2.x

```
Example Response:
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

Hello from version 1.2.3!
```


