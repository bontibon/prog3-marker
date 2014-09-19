/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['backbone', 'models/Line', 'collections/Lines'],
    function(Backbone, Line, Lines) {
  var model = Backbone.Model.extend({

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

    calculateMark: function() {
      var mark = this.get('worth');
      var lines = this.get('lines');
      var rules = [];
      lines.forEach(function(lineInfo) {
        var lineRules = lineInfo.get('rules');
        Array.prototype.push.apply(rules, lineRules);
      }, this);
      mark += this.get('rules').calculateMark(rules);
      return {
        mark: mark,
        possible: this.get('worth')
      };
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
      var finalMark = this.calculateMark();
      var header = 'Assignment mark: ' + finalMark.mark + '/' + finalMark.possible + '\n';
      var lines = this.get('lines');
      var rules = this.get('rules');
      lines.forEach(function(line) {
        line.get('rules').forEach(function(rule) {
          var description = rules.getCompleteDescription(rule).join(': ');
          var number = line.get('id') + 1;
          header += 'Line ' + number + ': ' + description + '\n';
        }, this);
      }, this);
      header += this._getSeparatorString('=', 79);

      return header + this.get('text');
    }
  });
  return model;
});
