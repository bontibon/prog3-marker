PREFIX = prog3-marker-dist

build: $(PREFIX) $(PREFIX)/README.md $(PREFIX)/index.html $(PREFIX)/LICENSE \
       $(PREFIX)/js $(PREFIX)/css $(PREFIX)/bower_components
	zip -r $(PREFIX).zip $(PREFIX)/

$(PREFIX):
	mkdir -p $@

$(PREFIX)/README.md: README.md
	cp $< $@

$(PREFIX)/index.html: index.html
	cp $< $@

$(PREFIX)/LICENSE: LICENSE
	cp $< $@

$(PREFIX)/js: js/
	cp -r $< $@

$(PREFIX)/css: css/
	cp -r $< $@

$(PREFIX)/bower_components: bower_components/
	mkdir -p $@/

	# autocompletejs
	mkdir -p $@/autocompletejs/releases/0.3.0/
	cp $</autocompletejs/releases/0.3.0/autocomplete-0.3.0.min.{css,js} \
	   $@/autocompletejs/releases/0.3.0/
	cp $</autocompletejs/LICENSE $@/autocompletejs/

	# backbone
	mkdir -p $@/backbone/
	cp $</backbone/{backbone.js,LICENSE} $@/backbone/

	# codemirror
	mkdir -p $@/codemirror/{lib,mode/clike,addon/display}/
	cp $</codemirror/lib/codemirror.{css,js} $@/codemirror/lib/
	cp $</codemirror/mode/clike/clike.js $@/codemirror/mode/clike/
	cp $</codemirror/addon/display/rulers.js $@/codemirror/addon/display/
	cp $</codemirror/LICENSE $@/codemirror/

	# jquery
	mkdir -p $@/jquery/dist/
	cp $</jquery/dist/jquery.min.js $@/jquery/dist/
	cp $</jquery/MIT-LICENSE.txt $@/jquery/

	# normalize-css
	mkdir -p $@/normalize-css/
	cp $</normalize-css/{normalize.css,LICENSE.md} $@/normalize-css/

	# requirejs
	mkdir -p $@/requirejs/
	cp $</requirejs/require.js $@/requirejs/

	# underscore
	mkdir -p $@/underscore/
	cp $</underscore/{underscore-min.js,LICENSE} $@/underscore/

clean:
	rm -rf $(PREFIX)/ $(PREFIX).zip

.PHONY: build clean
