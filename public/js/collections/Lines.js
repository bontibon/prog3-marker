/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['backbone', 'models/Line'], function(Backbone, Line) {
  return Backbone.Collection.extend({
    model: Line,
    comparator: 'id'
  });
});
