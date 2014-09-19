/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['backbone'], function(Backbone) {
  var model = Backbone.Model.extend({
    hasRules: function() {
      return this.has('rules') && (this.get('rules').length > 0);
    }
  });
  return model;
});
