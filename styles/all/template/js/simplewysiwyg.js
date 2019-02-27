window.senky_simplewysiwyg_editor = CKEDITOR.replace('message', {
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

// enable right-side smilies in wysiwyg
$('#smiley-box a[href="#"]').on('click', function() {
	var img = $(this).find('img');

	if (senky_simplewysiwyg_editor.mode == 'source') {
		var sourceTextarea = senky_simplewysiwyg_editor.container.$.querySelector('.cke_source');
		var caretPos = sourceTextarea.selectionStart;
		var value = sourceTextarea.value;

		sourceTextarea.value = value.substring(0, caretPos) + ' ' + img.attr('alt') + ' ' + value.substring(caretPos);
	} else {
		senky_simplewysiwyg_editor.insertElement(senky_simplewysiwyg_editor.document.createElement('img', {
			attributes: {
				src: img.attr('src'),
				'data-cke-saved-src': img.attr('src'),
				title: img.attr('title'),
				alt: img.attr('alt'),
				width: img.attr('width'),
				height: img.attr('height')
			}
		}));
	}
});

// enable placing attachment inline
$(document).on('click', '.file-inline-bbcode', function() {
	var attachId = $(this).parents('.attach-row').attr('data-attach-id');
	var index = phpbb.plupload.getIndex(attachId);
	var filename = phpbb.plupload.data[index].real_filename;

	if (senky_simplewysiwyg_editor.mode == 'source') {
		var sourceTextarea = senky_simplewysiwyg_editor.container.$.querySelector('.cke_source');
		var caretPos = sourceTextarea.selectionStart;
		var value = sourceTextarea.value;

		sourceTextarea.value = value.substring(0, caretPos) + '[attachment=' + index + ']' + filename + '[/attachment]' + value.substring(caretPos);
	} else {
		senky_simplewysiwyg_editor.insertHtml('<div attachid=' + index + '>' + filename + '</div>');
	}
});
