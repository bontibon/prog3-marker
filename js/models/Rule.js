/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['backbone'], function(Backbone) {
  return Backbone.Model.extend({
    loadString: function(str) {
      var matches = str.match(/\[([-+]?\d+)\]\s*$/);
      var obj;
      if (_.isNull(matches)) {
        obj = {
          value: 0,
          description: str
        };
      } else {
        obj = {
          value: parseInt(matches[1]),
          description: str.substring(0, str.length - matches[0].length)
        };
      }
      this.set(obj);
    }
  });
});
