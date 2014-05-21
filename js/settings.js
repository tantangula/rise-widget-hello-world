var RiseVision = RiseVision || {};
RiseVision.Text = {};
RiseVision.Text.Settings = {};

RiseVision.Text.Settings = (function($, gadgets) {
	"use strict";

	function init() {
		var $element = $("#editable");
		var editor = null;

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

		$(".font-picker").fontPicker({
			"contentDocument": editor.composer.iframe.contentDocument
		})
		.on("googleFontSelected", function() {
			// Pass font to editor.
			$(".bfh-googlefontlist").attr("data-wysihtml5-command-value", $(".font-picker").data("plugin_fontPicker").getFont());
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

				editor.setValue(result.data);
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