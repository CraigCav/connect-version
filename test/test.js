var request = require('supertest'),
    http = require('http'),
    connectVersion = require('../index');

describe('connect-version', function () {

  it('will pick middleware based on content-type version parameter', function (done) {

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
});
