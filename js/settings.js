var RiseVision = RiseVision || {};
RiseVision.Text = {};
RiseVision.Text.Settings = {};

RiseVision.Text.Settings = (function($, gadgets) {
	"use strict";

	var _googleFonts = [];
	var _editor = null;

	function _getSettings() {
		var settings = null, additionalParams = {};

		$(".errors").empty();

		additionalParams.data = $("#editable").val();
		additionalParams.googleFonts = _googleFonts;

	settings = {
			"params" : null,
			"additionalParams" : JSON.stringify(additionalParams)
		};

		$(".alert").hide();

		gadgets.rpc.call("", "rscmd_saveSettings", null, settings);
	}

	function init() {
		var $element = $("#editable");

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

		_editor = $element.data("wysihtml5").editor;

		$(".font-picker").fontPicker({
			"contentDocument": _editor.composer.iframe.contentDocument
		})
		.on("googleFontSelected", function(e, googleFont) {
			var found = false;

			$(".bfh-googlefontlist").attr("data-wysihtml5-command-value", googleFont);

			// Add font to array if it does not already exist.
			for (var i = 0; i < _googleFonts.length; i++) {
				if (_googleFonts[i] == googleFont) {
					found = true;
					break;
				}
			}

			if (!found) {
				_googleFonts.push(googleFont);
			}
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
			var util = RiseVision.Common.Utilities;

			//Settings have been saved before.
			if (result) {
				result = JSON.parse(result);
				_googleFonts = result.googleFonts;

				_editor.setValue(result.data);

				// Load all Google fonts.
				for (var i = 0; i < _googleFonts.length; i++) {
					util.loadGoogleFont(_googleFonts[i], _editor.composer.iframe.contentDocument);
					_editor.composer.commands.exec("googleFont", _googleFonts[i]);
				}
			}
		});
	}

	return {
		init: init
	};
})($, gadgets);