var contenttype = require('contenttype');
var semver = require('semver');

function matchContentType() {
  return function(req) {
    var acceptHeader = req.headers['accept'];
    var accepts = contenttype.splitContentTypes(acceptHeader)
      .map(contenttype.parseMedia);

    return accepts.map(function(accept) {
      return accept.params.version;
    });
  };
}

function notAcceptable(req, res) {
  res.statusCode = 406;
  res.statusMessage = 'Not Acceptable';
  res.end();
}

module.exports = function (options) {
  var versions = options.versions || {};
  var versionNumbers = Object.keys(versions);

  var matcher = typeof options.match === 'function' ? options.match : undefined;
  matcher = matcher || matchContentType(options);

  var fallback = options.default || notAcceptable;

  return function(req, res, next) {
    
    var acceptableVersions = matcher(req);

    var middleware;

    for(var accept of acceptableVersions) {
      if(accept in versions) {
        middleware = versions[accept];
        break;
      }
      for(var candidate of versionNumbers) {
        if(semver.satisfies(candidate, accept)) {
          middleware = versions[candidate];
          break;
        }
      }
    }

    middleware = middleware || fallback;

    middleware(req, res, next);
  };
};