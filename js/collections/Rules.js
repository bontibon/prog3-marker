/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['underscore', 'backbone', 'models/Rule'], function(_, Backbone, Rule) {
  return Backbone.Collection.extend({
    model: Rule,
    url: 'rules.txt',

    parse: function(resp) {
      // TODO: parse: child-bonus, child-count
      var nextID = 1;
      var models = [];
      var parents = [/*
      {
        id: _,
        depth: _,
      }
      */];
      var previous;
      var lines = resp.split("\n");
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.trim() == "" || line.startsWith('#')) {
          continue;
        }
        var match = line.match(/^\t*/);
        var depth = match[0].length;
        line = line.substring(depth);

        var model = {
          id: nextID++,
          depth: depth,
        };

        if (previous) {
          var diff = depth - previous.depth;
          if (diff < 0) {
            for (var j = diff; j < 0; j++) {
              parents.pop();
            }
            if (parents.length) {
              model.parent = parents[parents.length - 1].id;
            }
          } else if (diff > 0) {
            parents.push(previous);
            model.parent = previous.id;
          } else {
            if (parents.length) {
              model.parent = parents[parents.length - 1].id;
            }
          }
        }
        // TODO: parent

        match = line.match(/\[(-?\d+)?(?:\/(-?\d+))?\]\s*$/);
        if (match) {
          model.description = line.substring(0, line.length - match[0].length).trim();
          if (match[1] !== undefined) {
            model.value = parseInt(match[1]);
          }
          if (match[2] !== undefined) {
            model.maximum = parseInt(match[2]);
          }
        } else {
          model.description = line.trim();
        }
        previous = model;
        models.push(model);
      }
      console.log(models);
      return models;
    },

    fetch: function(options) {
      var collection = this;
      Backbone.ajax(this.url, {
        error: function(jqXHR, textStatus, errorThrown) {
          collection.trigger('error', textStatus);
        },
        success: function(data, textStatus, jqXHR) {
          collection.reset(data, {parse: true});
        },
      });
    },

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
