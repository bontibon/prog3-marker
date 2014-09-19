/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

var path = require('path');
var express = require('express');
var morgan = require('morgan');

var app = express();

// Middleware
app.use(morgan('short'));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Listen for requests
app.listen(8080, function() {
  console.log('Listening on port 8080');
});
