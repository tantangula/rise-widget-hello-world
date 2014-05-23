var RiseVision = RiseVision || {};
RiseVision.Text = {};
RiseVision.Text.Settings = {};

RiseVision.Text.Settings = (function($, gadgets) {
	"use strict";

	var _editor = null;

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
			.on("standardFontSelected", function(e, font, fontFamily) {
				_editor.composer.commands.exec("standardFont", font, fontFamily, [{
					name: "data-standard-font",
					value: font
				},
				{
					name: "data-standard-font-family",
					value: fontFamily
				}
				]);

				$element.focus();
			})
			.on("googleFontSelected", function(e, font) {
				_editor.composer.commands.exec("googleFont", font, [{
					name: "data-google-font",
					value: font
				}]);

				$element.focus();
			})
			.on("customFontSelected", function(e, font, fontURL) {
				_editor.composer.commands.exec("customFont", font, [{
					name: "data-custom-font",
					value: font
				},
				{
					name: "data-custom-font-url",
					value: fontURL
				}
				]);

				$element.focus();
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

		$("#cancel, #close").on("click", function() {
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
			var standardFont, googleFont, customFont;

			// Settings have been saved before.
			if (result) {
				result = JSON.parse(result);

				_editor.setValue(result.data);

				// Load all Google fonts.
				$.each($(result.data).find("span").andSelf(), function(index, value) {
					standardFont = $(this).attr("data-standard-font");
					googleFont = $(this).attr("data-google-font");
					customFont = $(this).attr("data-custom-font");

					if (standardFont) {
						_editor.composer.commands.exec("standardFont", standardFont, $(this).attr("data-standard-font-family"));
					}

					if (googleFont) {
						util.loadGoogleFont(googleFont, _editor.composer.iframe.contentDocument);
						// This won't add a new span tag because a range will not have been selected, which is what we want.
						_editor.composer.commands.exec("googleFont", googleFont, null);
					}

					if (customFont) {
						util.loadCustomFont(customFont, $(this).attr("data-custom-font-url"), _editor.composer.iframe.contentDocument);
						_editor.composer.commands.exec("customFont", customFont, $(this).attr("data-custom-font-url"));
					}
				});
			}
		});
	}

	return {
		init: init
	};
})($, gadgets);