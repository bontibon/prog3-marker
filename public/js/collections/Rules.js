/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['underscore', 'backbone', 'models/Rule'], function(_, Backbone, Rule) {
  return Backbone.Collection.extend({
    model: Rule,
    url: 'api/v1/rules',

    getCompleteDescription: function(rule) {
      var arr = [];
      while (true) {
        var description = rule.get('description');
        if (rule.has('value')) {
          var value = rule.get('value');
          description += ' [' + rule.get('value');
          if (rule.has('possible')) {
            var possible = rule.get('possible');
            if (value != possible) {
              description += '/' + rule.get('possible');
            }
          }
          description += ']';
        }
        arr.unshift(description);
        if (!rule.has('parent')) {
          break;
        }
        rule = this.get(rule.get('parent'));
      }
      return arr;
    }
  });
});
