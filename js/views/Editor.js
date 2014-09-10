/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['underscore', 'backbone', 'cm/lib/codemirror', 'views/LineComment',
        'cm/mode/clike/clike', 'cm/addon/display/rulers'],
    function(_, Backbone, CodeMirror, LineComment) {
  var view = Backbone.View.extend({
    initialize: function() {
      // Model
      this.listenTo(this.model, 'change:text', this.renderText);
      this.listenTo(this.model.get('lines'), 'change', this._lineUpdated);

      // CodeMirror
      this.editor = CodeMirror(this.el, {
        lineNumbers: true,
        tabSize: 8,
        indentWithTabs: true,
        readOnly: true,
        rulers: [{column: 79, color: '#CA7373'}],
        gutters: ['CodeMirror-linenumbers', 'line-hasComment'],
        mode: 'text/x-c'
      });
      this.editor.addOverlay({
        token: function(stream) {
          var chr = stream.next();
          if (chr == '\t') {
            return 'token-tab';
          }
          return null;
        },
        name: "whitespace"
      });
      this.editor.on('gutterClick', this._gutterClick.bind(this));

      // Map of active lines
      this.activeLines = {};
    },

    renderText: function() {
      var text = this.model.get('text') || '';
      this.editor.setValue(text);
    },

    _lineUpdated: function(line) {
      var hasRules = line.get('rules').length > 0;
      var element = null;
      if (hasRules) {
        element = $('<div>').addClass('line-hasComment-el').text('▶')[0];
      }
      this.editor.setGutterMarker(line.get('number'), 'line-hasComment',
          element);
    },

    // Triggered when the editor's gutter is clicked
    _gutterClick: function(editor, line, gutter, e) {
      var doc = this.editor.getDoc();
      // Line comment already exists for line
      if (_.has(this.activeLines, line)) {
        doc.removeLineClass(line, 'background', 'activeLine');
        this.activeLines[line].clear();
        delete this.activeLines[line];
        return;
      }

      if (!this.model.isValid()) {
        return;
      }

      // Show line widget
      var widget = new LineComment({
        model: this.model.getLine(line)
      });
      var handle = editor.addLineWidget(line, widget.el, {
        noHScroll: true
      });
      this.activeLines[line] = handle;
      doc.addLineClass(line, 'background', 'activeLine');
    }
  });
  return view;
});
