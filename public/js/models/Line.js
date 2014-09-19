/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['backbone'], function(Backbone) {
  return Backbone.Model.extend({
    hasRules: function() {
      return this.has('rules') && (this.get('rules').length > 0);
    }
  });

});
