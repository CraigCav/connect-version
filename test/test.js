var request = require('supertest'),
    http = require('http'),
    connectVersion = require('../index');

describe('connect-version', function () {

  it('will pick middleware based on accept header\'s version parameter', function (done) {

    var options = {
      versions: {
        '2.0.0-beta.1': function(req, res) {
          res.end('Hello from version 2.0.0-beta.1!');
        },
        '1.2.3': function(req, res) {
          res.end('Hello from version 1.2.3!');
        }
      },
      match: 'Content-Type' // this is the default matcher
    };

    var server = http.createServer(connectVersion(options));

    request(server)
      .get('/')
      .set('Accept', 'application/vnd.com.myservice+text;version=1.2.3')
      .expect('Hello from version 1.2.3!', done);
  });

  it('will skip to next middleware if no version parameter provided in accept header', function (done) {
    var options = {};

    var server = http.createServer(function(req, res) {
        var middleware = connectVersion(options);
        middleware(req, res, function() {
          res.end('next');
        });
    });

    request(server)
      .get('/')
      .set('Accept', 'application/json')
      .expect('next', done);
  });

  it('will provide a 406 "Not Acceptable" response if no known version satisfies accept header', function (done) {
    var options = {};

    var server = http.createServer(connectVersion(options));

    request(server)
      .get('/')
      .set('Accept', 'application/vnd.com.myservice+text;version=3.2.3')
      .expect(406, done);
  });

  it('will use the provided fallback response if no known version satisfies accept header', function (done) {
    var options = {
      fallback: function(req, res) {
        res.end('Hello from fallback version!');
      }
    };

    var server = http.createServer(connectVersion(options));

    request(server)
      .get('/')
      .set('Accept', 'application/vnd.com.myservice+text;version=3.2.3')
      .expect('Hello from fallback version!', done);
  });
});
