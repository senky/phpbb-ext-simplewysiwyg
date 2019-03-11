window.senky_simplewysiwyg_editor = CKEDITOR.replace('message', {
	customConfig: false,
	stylesSet: false,
	toolbar: [
		{ name: 'undo', items: ['Undo', 'Redo'] },
		{ name: 'all', items: ['Bold', 'Italic', 'Underline', senky_simplewysiwyg_quote ? 'Blockquote' : true, 'CodeSnippet', 'NumberedList', 'BulletedList', senky_simplewysiwyg_img ? 'Image' : true, senky_simplewysiwyg_url ? 'Link' : true, senky_simplewysiwyg_url ? 'Unlink' : true, 'TextColor', 'FontSize'] },
		{ name: 'mode', items: ['Source'] },
	],
	contentsCss: [
		CKEDITOR.basePath + '../../../theme/contents.css',
		CKEDITOR.basePath + '../../../../../../../../assets/css/font-awesome.min.css'
	],
	language: senky_simplewysiwyg_lang,

	// autogrow
	autoGrow_minHeight: 280,
	autoGrow_onStartup: true,

	// font
	fontSize_sizes: senky_simplewysiwyg_fontSize_sizes,

	// codesnippet
	codeSnippet_languages: {},

	// smiley
	smiley_images: senky_simplewysiwyg_smiley_images,
	smiley_descriptions: senky_simplewysiwyg_smiley_descriptions,
	smiley_path: senky_simplewysiwyg_smiley_path,
});

// replaces function defined in assets/javascript/editor.js
window.insert_text = function(text, spaces) {
	var modeChanged = false;

	if (spaces) {
		text = ' ' + text + ' ';
	}

	// Since we can't programatically convert text to HTML, let's switch editor
	// to source mode for a while, insert text and then switch back. It is very
	// fast, user won't even notice it.
	if (senky_simplewysiwyg_editor.mode != 'source') {
		modeChanged = senky_simplewysiwyg_editor.mode;
		senky_simplewysiwyg_editor.setMode('source');
	}

	var sourceTextarea = senky_simplewysiwyg_editor.container.$.querySelector('.cke_source');
	var caretPos = sourceTextarea.selectionStart;
	var value = sourceTextarea.value;

	sourceTextarea.value = value.substring(0, caretPos) + text + value.substring(caretPos);

	if (modeChanged) {
		senky_simplewysiwyg_editor.setMode(modeChanged);
	}
}

// replaces function defined in assets/javascript/plupload.js
phpbb.plupload.updateBbcode = function(action, index) {
	var editor = senky_simplewysiwyg_editor,
		text = editor.getData(),
		removal = (action === 'removal');

	// Return if the bbcode isn't used at all.
	if (text.indexOf('[attachment=') === -1) {
		return;
	}

	function runUpdate(i) {
		var regex = new RegExp('\\[attachment=' + i + '\\](.*?)\\[\\/attachment\\]', 'g');
		text = text.replace(regex, function updateBbcode(_, fileName) {
			// Remove the bbcode if the file was removed.
			if (removal && index === i) {
				return '';
			}
			var newIndex = i + ((removal) ? -1 : 1);
			return '[attachment=' + newIndex + ']' + fileName + '[/attachment]';
		});
	}

	// Loop forwards when removing and backwards when adding ensures we don't
	// corrupt the bbcode index.
	var i;
	if (removal) {
		for (i = index; i < phpbb.plupload.ids.length; i++) {
			runUpdate(i);
		}
	} else {
		for (i = phpbb.plupload.ids.length - 1; i >= index; i--) {
			runUpdate(i);
		}
	}

	if (editor.mode == 'source') {
		editor.container.$.querySelector('.cke_source').value = text;
	}
	else {
		editor.setData(text);
	}
};
