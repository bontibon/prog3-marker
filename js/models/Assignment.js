/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['underscore', 'backbone', 'models/Line', 'collections/Lines'],
    function(_, Backbone, Line, Lines) {
  return Backbone.Model.extend({

    initialize: function() {
      // Initialize attributes
      this.set('lines', new Lines());

      // FileReader
      this._fileReader = new FileReader();
      this._fileReader.addEventListener('load', this._fileLoaded.bind(this));
    },

    validate: function() {
      if (!this.has('text')) {
        return 'document is empty';
      }
    },

    // Load a `File` into the model.
    loadFile: function(file) {
      this.get('lines').reset();
      this.set('name', file.name);
      this._fileReader.readAsText(file);
    },

    // A File's contents have been loaded.
    _fileLoaded: function(e) {
      var text = e.target.result;
      this.set('text', text);
    },

    getLine: function(lineNumber) {
      var lines = this.get('lines');
      var line = lines.get(lineNumber);
      if (line) {
        return line;
      }
      return lines.add({
        id: lineNumber,
        document: this
      });
    },

    calculateFinal: function() {
      var finalRules = this._getFinalRules();
      return this._getFinalMark(finalRules);
    },

    _getFinalMark: function(rules) {
      var final = {
        mark: this.get('worth'),
        possible: this.get('worth'),
        rules: rules
      };
      var rules = this.get('rules');
      var map = {};
      final.rules.forEach(function(rule) {
        var func = function(rule, value, map) {
          var id = rule.id;
          if (!_.has(map, id)) {
            map[id] = 0;
          }
          if (rule.has('maximum')) {
            var maximum = rule.get('maximum');
            if ((maximum < 0 && value + map[id] < maximum) ||
                (maximum > 0 && value + map[id] > maximum)) {
              value = maximum - map[id];
            }
            map[id] += value;
          }
          if (!rule.has('parent')) {
            return value;
          }
          var parent = rules.get(rule.get('parent'));
          return func(parent, value, map);
        };
        var possible = rule.get('value');
        var value = func(rule, possible, map);
        rule.set({
          'value': value,
          'possible': possible
        });
        final.mark += value;
      }, this);
      return final;
    },

    _getFinalRules: function() {
      var rules = this.get('rules');
      var map = {};
      var finalRules = [];
      this.get('lines').forEach(function(line) {
        line.get('rules').forEach(function(rule) {
          if (!rule.has('value')) {
            return;
          }
          var func = function(base, rule, map, child) {
            var id = rule.id;
            if (!_.has(map, id)) {
              map[id] = {
                childIds: {},
                bonusAwarded: false
              };
            }
            if (child && child.id) {
              var childId = child.id;
              map[id].childIds[childId] = true;
              if (rule.has('child-bonus') && rule.has('child-count') &&
                  _.size(map[id].childIds) >= rule.get('child-count') && !map[id].bonusAwarded) {
                finalRules.push(rule.clone().set({
                  'line': line.id,
                  'value': rule.get('child-bonus')
                }));
                map[id].bonusAwarded = true;
              }
            }
            if (!rule.has('parent')) {
              finalRules.push(base.clone().set({
                line: line.id
              }));
              return;
            }
            var parent = rules.get(rule.get('parent'));
            return func(base, parent, map, rule);
          };
          func(rule, rule, map);
        }, this);
      }, this);
      return finalRules;
    },

    _getSeparatorString: function(chr, length) {
      var str = '';
      for (var i = 0; i < length; i++) {
        str += chr;
      }
      str += '\n';
      return str;
    },

    getMarkedText: function() {
      if (!this.isValid()) {
        return null;
      }
      var final = this.calculateFinal();
      var header = 'Assignment mark: ' + final.mark + '/' + final.possible + '\n';
      final.rules.forEach(function(rule) {
        var description = this.get('rules').getCompleteDescription(rule).join(': ');
        var line = rule.get('line') + 1;
        header += 'Line ' + line + ': ' + description + '\n';
      }, this);
      return header + this._getSeparatorString('=', 79) + this.get('text');
    }
  });
});
