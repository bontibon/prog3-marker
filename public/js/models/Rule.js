/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['backbone'], function(Backbone) {
  var model = Backbone.Model.extend({
    loadString: function(str) {
      var matches = str.match(/^([-+]?\d+):?\s*(.*)$/);
      var obj;
      if (_.isNull(matches)) {
        obj = {
          value: 0,
          description: str
        };
      } else {
        obj = {
          value: parseInt(matches[1]),
          description: matches[2]
        };
      }
      this.set(obj);
    }
  });
  return model;
});
