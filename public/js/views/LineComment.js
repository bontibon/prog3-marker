/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['underscore', 'backbone', 'autocomplete'], function(_, Backbone) {
  return Backbone.View.extend({
    tagName: 'div',
    className: 'line-comment',

    initialize: function() {
      // Autocomplete container
      this.$container = $('<div>');
      this.$el.append(this.$container);

      // Create autocomplete
      var config = {
        initialList: '_root',
        tokenSeparatorHTML: ': ',
        onChange: this._onChange.bind(this),
        lists: {
          _root: {
            allowFreeform: true
          }
        }
      };
      this.ac = new AutoComplete(this.$container, config);

      // Load possible rules into autocomplete
      var rules = this._getRules();
      rules.forEach(this._addRuleToAutocomplete, this);

      // Load line rules
      this.ac.setValue(this._getWidgets());
    },

    _addRuleToAutocomplete: function(rule) {
      var parent = rule.has('parent') ? rule.get('parent').toString() : '_root';
      if (rule.has('value')) {
        this.ac.addOption(parent, {
          optionHTML: rule.escape('description') + ' [' + rule.get('value') + ']',
          value: rule
        });
      } else if (rule.has('id')) {
        var id = rule.get('id').toString();
        this.ac.setList(id, {
          options: [],
          allowFreeform: true
        });
        this.ac.addOption(parent, {
          children: id,
          optionHTML: rule.escape('description'),
          value: rule
        });
      }
    },

    _buildWidget: function(rule) {
      var rules = this._getRules();
      var arr = [];
      while (true) {
        var description = rule.escape('description');
        if (rule.has('value')) {
          description += ' [' + rule.get('value') + ']';
        }
        arr.unshift({
          tokenHTML: description,
          value: rule
        });
        if (!rule.has('parent')) {
          break;
        }
        rule = rules.get(rule.get('parent'));
      }
      return arr;
    },

    _getWidgets: function() {
      var existingRules = this.model.get('rules') || [];
      return existingRules.map(this._buildWidget, this);
    },

    _onChange: function(selection) {
      var rules = this._getRules();
      var lineRules = [];
      var newSelection = selection.map(function(cur) {
        var last = cur[cur.length - 1];
        var value = last.value;
        if (_.isString(value)) {
          // New rule
          var parentId;
          if (cur.length > 1) {
            parentId = rules.get(cur[cur.length - 2].value).get('id')
          }
          var newRule = new rules.model({
            id: _.uniqueId(),
            parent: parentId
          });
          newRule.loadString(value);
          lineRules.push(rules.add(newRule));
          this._addRuleToAutocomplete(newRule);
          return this._buildWidget(newRule);
        } else {
          // Existing rule
          var model = rules.get(value);
          if (model) {
            lineRules.push(model);
          } else {
            console.log('error: rule does not have ID; cannot be used');
          }
        }
        return cur;
      }, this);
      this.model.set('rules', lineRules);
      return newSelection;
    },

    _getRules: function() {
      return this.model.get('document').get('rules');
    }
  });
});
