/**
 * Author: Tim Cooper <tim.cooper@layeh.com>
 * License: GPLv3
 */

define(['jquery', 'backbone', 'views/Editor', 'collections/Rules'],
    function($, Backbone, EditorView, Rules) {
  return Backbone.View.extend({
    el: 'body',

    events: {
      'click #btn-save': '_save',
      'click #btn-load': '_load',
      'change #input-worth': '_changeWorth'
    },

    initialize: function() {
      // Marking scheme
      var rules = new Rules();
      rules.fetch();
      this.listenTo(rules, 'error', this._rulesError);
      this.model.set('rules', rules);

      // Editor
      this.$editor = this.$('main');
      this.editor = new EditorView({
        el: this.$editor,
        model: this.model
      });

      // Page events
      $(window).on('beforeunload', this._windowUnload.bind(this));

      // Current mark
      this.$currentMark = this.$('#lbl-current-mark');
      this.listenTo(this.model, 'change:text', this._updateCurrentMark);
      this.listenTo(this.model.get('lines'), 'change', this._updateCurrentMark);

      // Assignment worth
      this.$worth = this.$('#input-worth');
      this._changeWorth();
    },

    _load: function() {
      var $input = $('<input>')
        .attr('type', 'file')
        .on('change', this._fileChanged.bind(this));
      $input.click();
      return false;
    },

    _rulesError: function(rules, err) {
      alert('Rules error: ' + err.statusText);
    },

    _updateCurrentMark: function() {
      var value = this.model.isValid() ? this.model.calculateMark().mark : 0;
      this.$currentMark.text(value);
    },

    // Triggered when a file is selected from the input box.
    _fileChanged: function(e) {
      var files = e.currentTarget.files;
      if (files.length <= 0) {
        return;
      }
      this.model.loadFile(files[0]);
    },

    // Triggered when page is about to be unloaded.
    _windowUnload: function(e) {
      if (!this.model.isValid()) {
        return;
      }
      return 'Navigating away from this page will cause your notes to disappear.';
    },

    _changeWorth: function() {
      var val = parseInt(this.$worth.val());
      this.model.set('worth', val);
      this._updateCurrentMark();
    },

    // Save document.
    _save: function(e) {
      if (!this.model.isValid()) {
        return;
      }
      var $el = $(e.currentTarget);
      var marked = this.model.getMarkedText();
      $el.attr({
        download: 'marked-' + this.model.get('name'),
        href: 'data:text/plain;charset=UTF-8,' + encodeURIComponent(marked)
      });
    }
  });
});
