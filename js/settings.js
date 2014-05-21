var RiseVision = RiseVision || {};
RiseVision.Text = {};
RiseVision.Text.Settings = {};

RiseVision.Text.Settings = (function($, gadgets) {
	"use strict";

	function init() {
		var $element = $("#editable");
		var editor = null;
		var contentDocument = null;
		var regex = null;

		// Configure editor toolbar.
		$element.wysihtml5({
			"toolbar": {
				"font-picker":
					"<li>" +
						"<div class='font-picker'>" +
						"</div>" +
					"</li>"
			},
			"font-styles": false,
			"lists": false,
			"link": false,
			"image": false,
			//"color": true,
			//"html": true,
			//"font-size": true
		});

		editor = $element.data("wysihtml5").editor;
		contentDocument = editor.composer.iframe.contentDocument;
		regex = /wysiwyg-font-family-[a-z\-]+/g;	//TODO: May not work correctly.

		/* TODO: Extend the editor so that other apps can use this functionality.
			 Create a command for selecting a Google font. */
		wysihtml5.commands.googleFont = {
			exec: function(composer, command) {
				var family = $(".font-picker").data("plugin_fontPicker").getFont();
				var className = "wysiwyg-font-family-" +
					family.replace(" ", "-").toLowerCase();
				var style = document.createElement("style");

				// Add a CSS class for the selected font.
				style.type = "text/css";
				style.innerHTML = "." + className +
					" { font-family: '" + family + "', serif; }";
				contentDocument.getElementsByTagName("head")[0].appendChild(style);

				return wysihtml5.commands.formatInline.exec(composer, command, "span",
					className, regex);
			},
			state: function(composer, command) {
				var family = $(".font-picker").data("plugin_fontPicker").getFont();

				return wysihtml5.commands.formatInline.state(composer, command, "span",
					"wysiwyg-font-family-" + family.replace(" ", "-").toLowerCase(), regex);
			}
		};

		$(".font-picker").fontPicker({
			"contentDocument": contentDocument
		});

		i18n.init(function(t) {
			$(".widget-wrapper").i18n().show();

			// Set buttons to be sticky only after wrapper is visible.
			$(".buttons").sticky({
				container : $("#wrapper"),
				topSpacing : 41
			});
		});

		$("#save").on("click", function() {
			_getSettings();
		});

		$("#cancel, #settings-close").on("click", function() {
			gadgets.rpc.call("", "rscmd_closeSettings", null);
		});

		$("#help").on("click", function() {
			window.open("http://www.risevision.com/help/users/what-are-gadgets/content/playlist-item-text-editor/", "_blank");
		});

		$(".alert").hide();

		//Request additional parameters from the Viewer.
		gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {
			var prefs = new gadgets.Prefs();

			//Settings have been saved before.
			if (result) {
				result = JSON.parse(result);
			}
		});
	}

	function _getSettings() {
		var settings = null, additionalParams = {};

		$(".errors").empty();

		additionalParams.data = $("#editable").val();

	settings = {
			"params" : null,
			"additionalParams" : JSON.stringify(additionalParams)
		};

		$(".alert").hide();

		gadgets.rpc.call("", "rscmd_saveSettings", null, settings);
	}

	return {
		init: init
	};
})($, gadgets);