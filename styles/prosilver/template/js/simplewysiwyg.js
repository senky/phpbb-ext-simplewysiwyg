var editor = CKEDITOR.replace('message', {
	toolbar: [
		{ name: 'undo', items: ['Undo', 'Redo'] },
		{ name: 'all', items: ['Bold', 'Italic', 'Underline', senky_simplewysiwyg_quote ? 'Blockquote' : true, 'CodeSnippet', 'NumberedList', 'BulletedList', senky_simplewysiwyg_img ? 'Image' : true, senky_simplewysiwyg_url ? 'Link' : true, senky_simplewysiwyg_url ? 'Unlink' : true, 'TextColor', 'FontSize'] },
		{ name: 'mode', items: ['Source'] },
	],
	contentsCss: [CKEDITOR.basePath + '../../../theme/contents.css', CKEDITOR.basePath + '../../../../../../../../assets/css/font-awesome.min.css'],
	height: 280,
	extraPlugins: 'bbcode,font,colorbutton,attachment',
	removePlugins: 'filebrowser,format,horizontalrule,pastetext,pastefromword,scayt,showborders,stylescombo,table,tabletools,tableselection,wsc',
	removeButtons: 'Anchor,BGColor,Font,Strike,Subscript,Superscript,JustifyBlock',
	disableObjectResizing: true,
	fontSize_sizes: senky_simplewysiwyg_fontSize_sizes,
	codeSnippet_languages: {},
	smiley_images: senky_simplewysiwyg_smiley_images,
	smiley_descriptions: senky_simplewysiwyg_smiley_descriptions,
	smiley_path: senky_simplewysiwyg_smiley_path,
});

// enable right-side smilies in wysiwyg
var smilies = document.querySelectorAll('#smiley-box a');
[].forEach.call(smilies, function(smiley) {
	smiley.addEventListener('click', function() {
		var img = this.querySelector('img');

		if (editor.mode == 'source') {
			var sourceTextarea = editor.container.$.querySelector('.cke_source');
			var caretPos = sourceTextarea.selectionStart;
			var value = sourceTextarea.value;

			sourceTextarea.value = value.substring(0, caretPos) + ' ' + img.getAttribute('alt') + ' ' + value.substring(caretPos);
		} else {
			editor.insertElement(editor.document.createElement('img', {
				attributes: {
					src: img.getAttribute('src'),
					'data-cke-saved-src': img.getAttribute('src'),
					title: img.getAttribute('title'),
					alt: img.getAttribute('alt'),
					width: img.getAttribute('width'),
					height: img.getAttribute('height')
				}
			}));
		}
	});
});

// enable placing attachment inline
$(document).on('click', '.file-inline-bbcode', function() {
	var attachId = $(this).parents('.attach-row').attr('data-attach-id');
	var index = phpbb.plupload.getIndex(attachId);
	var filename = phpbb.plupload.data[index].real_filename;

	if (editor.mode == 'source') {
		var sourceTextarea = editor.container.$.querySelector('.cke_source');
		var caretPos = sourceTextarea.selectionStart;
		var value = sourceTextarea.value;

		sourceTextarea.value = value.substring(0, caretPos) + '[attachment=' + index + ']' + filename + '[/attachment]' + value.substring(caretPos);
	} else {
		var element = editor.document.createElement('div', {
			attributes: {
				attachid: index
			}
		});
		element.appendText(filename);

		editor.insertElement(element);
	}
});
