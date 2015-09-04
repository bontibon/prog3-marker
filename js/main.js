/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

// requirejs configuration
require.config({
  paths: {
    jquery: '../bower_components/jquery/dist/jquery.min',
    autocomplete: '../bower_components/autocompletejs/releases/0.3.0/autocomplete-0.3.0.min',
    cm: '../bower_components/codemirror',
    underscore: '../bower_components/underscore/underscore-min',
    backbone: '../bower_components/backbone/backbone'
  },
  shim: {
    autocomplete: ['jquery']
  }
});

// Start application
require(['views/App', 'models/Assignment'], function(AppView, Assignment) {
  console.log('prog3-marker started');
  new AppView({
    model: new Assignment()
  });
});
