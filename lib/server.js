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

// API
var api = express.Router();
app.use('/api/v1', api);

api.get('/rules', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'rules.json'));
});

// Listen for requests
app.listen(8080, function() {
  console.log('Listening on port 8080');
});
