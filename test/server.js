
/**
 * @description static content server
 * (for running tests)
 */

var app
  , mimeTypes
  , fs = require('fs')
  , path = require('path')
  , http = require('http')
  , express = require('express');

mimeTypes = {
  js   : 'application/javascript',
  css  : 'text/css',
  html : 'text/html'
};

app = express();

app.configure('development', function() {
  const ASSET_DIRECTORIES = [
    path.normalize(__dirname + '/spec/'),
    path.normalize(__dirname + '/../src/'),
    path.normalize(__dirname + '/../bower_components/')
  ];
  ASSET_DIRECTORIES.forEach(function(directory) {
    app.use(express.static(directory));
  });
});

app.get('*', function(request, response, next) {
  var indexFile, fileStream;
  if (/(\.js)$/.test(request.url)) {
    return next();
  }
  indexFile = __dirname + '/spec/index.html';
  fileStream = fs.createReadStream(indexFile);
  response.writeHead(200, { 'Content-Type' : 'text/html' });
  fileStream.on('data', function(data) {
    response.write(data);
  });
  fileStream.on('end', function() {
    response.end();
  });
});

app.listen(8888, function() {
  console.log('[blend, test server]> http://localhost:8888/');
});
