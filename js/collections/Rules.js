/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['underscore', 'backbone', 'models/Rule'], function(_, Backbone, Rule) {
  var collection = Backbone.Collection.extend({
    model: Rule,

    initialize: function() {
      this._fileReader = new FileReader();
      this._fileReader.addEventListener('load', this._fileLoaded.bind(this));
    },

    loadFile: function(file) {
      this._fileReader.readAsText(file);
    },

    _fileLoaded: function(e) {
      var text = e.target.result;
      try {
        var json = JSON.parse(text);
        this.add(json);
      } catch (ex) {
        this.trigger('fileError', ex.toString());
      }
    },

    getCompleteDescription: function(rule) {
      var arr = [];
      while (true) {
        var description = rule.get('description');
        if (rule.has('value')) {
          description += ' [' + rule.get('value') + ']';
        }
        arr.unshift(description);
        if (!rule.has('parent')) {
          break;
        }
        rule = this.get(rule.get('parent'));
      }
      return arr;
    },

    _calculateRuleValue: function(rule, value, map) {
      if (rule.has('maximum')) {
        var maximum = rule.get('maximum');
        var id = rule.id;
        if (!_.has(map, id)) {
          map[id] = 0;
        }
        if ((maximum < 0 && value + map[id] < maximum) ||
            (maximum > 0 && value + map[id] > maximum)) {
          value = maximum - map[id];
        }
        map[id] += value;
      }
      if (!rule.has('parent')) {
        return value;
      }
      var parent = this.get(rule.get('parent'));
      return this._calculateRuleValue(parent, value, map);
    },

    // Given a list of applied rules, calculates the number of points that need
    // to be added to an assignment mark.
    calculateMark: function(arr) {
      var total = 0;
      var parents = {};
      arr.forEach(function(rule) {
        var value = rule.get('value');
        total += this._calculateRuleValue(rule, value, parents);
      }, this);
      return total;
    }
  });
  return collection;
});
