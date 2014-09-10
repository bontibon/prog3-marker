/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['backbone', 'models/Line'], function(Backbone, Line) {
  var collection = Backbone.Collection.extend({
    model: Line,
    comparator: 'id'
  });
  return collection;
});
