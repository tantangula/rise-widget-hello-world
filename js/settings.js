var RiseVision = RiseVision || {};
RiseVision.Text = {};
RiseVision.Text.Settings = {};

RiseVision.Text.Settings = (function($, gadgets) {
  "use strict";

  var _editor = null;
  var textColor = "";
  var FONT_SIZE_PICKER_STYLESHEET =
    "http://s3.amazonaws.com/rise-common-test/styles/bootstrap-font-size-picker/bootstrap-font-size-picker.css";
  var HELP_URL =
    "http://www.risevision.com/help/users/what-are-gadgets/content/playlist-item-text-editor/";

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

  function _configureColorPicker($elem, command, attribute) {
    $elem.spectrum({
      color: "#000",
      showInput: true,
      chooseText: "Apply",
      cancelText: "Cancel",
      change: function(color) {
        var hexColor = color.toHexString();

        _editor.composer.commands.exec(command, hexColor, [{
          name: attribute,
          value: hexColor
        }]);
      },
    });
  }

  function init() {
    var $editable = $("#editable");

    // Configure editor toolbar.
    $editable.wysihtml5({
      "toolbar": {
        "text-color":
           "<li>" +
            "<input id='text-color' type='color' />" +
          "</li>",
        "highlight-color":
           "<li>" +
            "<input id='highlight-color' type='color' />" +
          "</li>",
        "font":
          "<li>" +
            "<div class='font-picker'>" +
            "</div>" +
          "</li>",
        "font-size":
          "<li>" +
            "<div class='font-size-picker'>" +
            "</div>" +
          "</li>",
      },
      "font-styles": false,
      "lists": false,
      "link": false,
      "image": false,
      "color": false,
      "html": false,
      "stylesheets": [FONT_SIZE_PICKER_STYLESHEET],
    });

    // When the user clicks in the editor, find the font and font size
    // for that element and set those values in the appropriate dropdowns.
    $(".wysihtml5-sandbox").contents().find("body").on("click", function() {
      var font = "", fontSize = "", color = "", highlightColor = "";
      var node = null, parentNode = null;

      // Hide color pickers.
      $("#text-color").spectrum("hide");
      $("#highlight-color").spectrum("hide");

      node = _editor.composer.selection.getSelectedNode();

      if (node) {
        // This is a text node.
        if (node.nodeType === 3) {
          parentNode = node.parentNode;

          // The parent node is an element.
          if (parentNode && parentNode.nodeType === 1) {
            // The parent node is not the editor element itself.
            if (parentNode.tagName.toLowerCase() !== "body") {
              font = window.getComputedStyle(parentNode, null)
                .getPropertyValue("font-family");
              fontSize = window.getComputedStyle(parentNode, null)
                .getPropertyValue("font-size");
              color = window.getComputedStyle(parentNode, null)
                .getPropertyValue("color");
              highlightColor = window.getComputedStyle(parentNode, null)
                .getPropertyValue("background-color");

              if (font) {
                $(".font-picker").data("plugin_fontPicker").setFont(font);
              }

              if (fontSize) {
                $(".font-size-picker").data("plugin_fontSizePicker")
                  .setFontSize(fontSize);
              }

              if (color) {
                $("#text-color").spectrum("set", color);
              }

              if (highlightColor) {
                $("#highlight-color").spectrum("set", highlightColor);
              }
            }
          }
        }
      }
    });

    _editor = $editable.data("wysihtml5").editor;

    // Initialize the font picker.
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

        $editable.focus();
      })
      .on("googleFontSelected", function(e, font) {
        _editor.composer.commands.exec("googleFont", font, [{
          name: "data-google-font",
          value: font
        }]);

        $editable.focus();
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

        $editable.focus();
      });

    // Initialize the font size picker.
    $(".font-size-picker").fontSizePicker({})
      .on("change.bfhselectbox", function() {
        _editor.composer.commands.exec("fontSize",
          $(this).find(".bfh-fontsizes").val());
      });

    // Initialize the color pickers.
    _configureColorPicker($("#text-color"), "textColor", "data-text-color");
    _configureColorPicker($("#highlight-color"), "highlightColor", "data-highlight-color");

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
      window.open(HELP_URL, "_blank");
    });

    $(".alert").hide();

    //Request additional parameters from the Viewer.
    gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {
      var prefs = new gadgets.Prefs();
      var util = RiseVision.Common.Utilities;
      var standardFont, googleFont, customFont;
      var textColor, highlightColor;

      // Settings have been saved before.
      if (result) {
        result = JSON.parse(result);

        _editor.setValue(result.data);

        $.each($(result.data).find("span").andSelf(), function(index, value) {
          standardFont = $(this).attr("data-standard-font");
          googleFont = $(this).attr("data-google-font");
          customFont = $(this).attr("data-custom-font");
          textColor = $(this).attr("data-text-color");
          highlightColor = $(this).attr("data-highlight-color");

          // Add CSS for standard fonts.
          if (standardFont) {
            _editor.composer.commands.exec("standardFont", standardFont,
              $(this).attr("data-standard-font-family"));
          }

          // Load and add CSS for Google fonts.
          if (googleFont) {
            $(".font-picker").data("plugin_fontPicker")
              .addGoogleFont(googleFont, false);

            // This won't add a new span tag because a range will not have been
            // selected, which is what we want.
            _editor.composer.commands.exec("googleFont", googleFont);
          }

          // Load and add CSS for custom fonts.
          if (customFont) {
            util.loadCustomFont(customFont, $(this).attr("data-custom-font-url"),
              _editor.composer.iframe.contentDocument);
            _editor.composer.commands.exec("customFont", customFont,
              $(this).attr("data-custom-font-url"));
          }

          // Add CSS for colors.
          if (textColor) {
            _editor.composer.commands.exec("textColor", textColor);
          }

          if (highlightColor) {
            _editor.composer.commands.exec("highlightColor", highlightColor);
          }
        });
      }
    });
  }

  return {
    init: init
  };
})($, gadgets);