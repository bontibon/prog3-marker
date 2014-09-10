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

    _calculateRuleValue: function(rule, value, map, child) {
      var id = rule.id;
      if (!_.has(map, id)) {
        map[id] = {
          subvalue: 0,
          childIds: {},
          bonusAwarded: false
        };
      }
      if (child && child.id) {
        var childId = child.id;
        map[id].childIds[childId] = true;
        if (rule.has('child-bonus') && rule.has('child-count') &&
            _.size(map[id].childIds) >= rule.get('child-count') && !map[id].bonusAwarded) {
          value += rule.get('child-bonus');
          map[id].bonusAwarded = true;
        }
      }
      if (rule.has('maximum')) {
        var maximum = rule.get('maximum');
        if ((maximum < 0 && value + map[id].subvalue < maximum) ||
            (maximum > 0 && value + map[id].subvalue > maximum)) {
          value = maximum - map[id].subvalue;
        }
        map[id].subvalue += value;
      }
      if (!rule.has('parent')) {
        return value;
      }
      var parent = this.get(rule.get('parent'));
      return this._calculateRuleValue(parent, value, map, rule);
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
