window.senky_simplewysiwyg_editor = CKEDITOR.replace('message', {
	// customConfig: false,
	// stylesSet: false,
	toolbar: [
		{ items: ['Undo', 'Redo'] },
		{ items: ['Bold', 'Italic', 'Underline', senky_simplewysiwyg_quote ? 'Blockquote' : true, 'CodeSnippet', 'NumberedList', 'BulletedList', senky_simplewysiwyg_img ? 'Image' : true, senky_simplewysiwyg_url ? 'Link' : true, senky_simplewysiwyg_url ? 'Unlink' : true, 'TextColor', 'FontSize'] },
		{ items: ['Source'] },
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

// hide BBcode buttons once CKEditor is initialised
window.senky_simplewysiwyg_editor.once('instanceReady', function() {
	var buttons = document.getElementById('format-buttons');
	buttons.parentElement.removeChild(buttons);
});

// replaces function defined in assets/javascript/editor.js
window.insert_text = function(text, spaces) {
	if (spaces) {
		text = ' ' + text + ' ';
	}

	if (senky_simplewysiwyg_editor.mode == 'source') {
		var sourceTextarea = senky_simplewysiwyg_editor.container.$.querySelector('.cke_source');
		var caretPos = sourceTextarea.selectionStart;
		var value = sourceTextarea.value;

		sourceTextarea.value = value.substring(0, caretPos) + text + value.substring(caretPos);
	} else {
		var html = CKEDITOR.BBCodeToHtml(text);
		senky_simplewysiwyg_editor.insertHtml(html);
	}
};

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
	} else {
		editor.setData(text);
	}
};
