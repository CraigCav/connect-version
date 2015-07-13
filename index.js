var contenttype = require('contenttype');
var semver = require('semver');

function matchContentType() {
  return function(req) {
    var acceptHeader = req.headers['accept'] || '';
    var accepts = contenttype.splitContentTypes(acceptHeader)
      .map(contenttype.parseMedia);

    return accepts.filter(function(accept) {
      return accept.params.version;
    }).map(function(accept) {
      return accept.params.version;
    });
  };
}

function notAcceptable(req, res) {
  res.statusCode = 406;
  res.statusMessage = 'Not Acceptable';
  res.end();
}

function findBestMatch(versions, accepts) {
  var middleware, accept;

  for(var i=0; i < accepts.length; ++i) {
    accept = accepts[i];
    if(accept in versions) {
      middleware = versions[accept];
      break;
    }
    for(var candidate in versions) {
      if(semver.satisfies(candidate, accept)) {
        middleware = versions[candidate];
        break;
      }
    }
  }
  return middleware;
}

module.exports = function (options) {
  var versions = options.versions || {};

  var matcher = typeof options.match === 'function' ? options.match : undefined;
  matcher = matcher || matchContentType(options);

  var fallback = options.fallback || notAcceptable;

  return function(req, res, next) {

    var acceptableVersions = matcher(req);

    if(!acceptableVersions.length) return next();

    var middleware = findBestMatch(versions, acceptableVersions) || fallback;

    middleware(req, res, next);
  };
};

module.exports.matchContentType = matchContentType;