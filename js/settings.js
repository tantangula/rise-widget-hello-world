var RiseVision = RiseVision || {};
RiseVision.Text = {};
RiseVision.Text.Settings = {};

RiseVision.Text.Settings = (function($, gadgets) {
  "use strict";

  var _editor = null;
  var $_editable = $("#editable");
  var $_fontPicker, $_fontSizePicker;
  var $_textColor, $_highlightColor, $_backgroundColor;
  var FONT_SIZE_PICKER_STYLESHEET =
    "http://s3.amazonaws.com/rise-common-test/styles/bootstrap-font-size-picker/bootstrap-font-size-picker.css";
  var HELP_URL =
    "http://www.risevision.com/help/users/what-are-gadgets/content/playlist-item-text-editor/";

  function _getSettings() {
    var settings = null, additionalParams = {};
    var backgroundColor = _editor.composer.doc.body
      .getAttribute("data-background-color");

    $(".errors").empty();

    // Put background color in additionalParams due to RVA issue 1075.
    additionalParams["background-color"] = backgroundColor;
    additionalParams.data = $_editable.val();

    settings = {
      "params": null,
      "additionalParams": JSON.stringify(additionalParams)
    };

    $(".alert").hide();

    gadgets.rpc.call("", "rscmd_saveSettings", null, settings);
  }

  function _configureColorPicker(options) {
    options.elem.spectrum({
      type: options.type,
      color: options.color,
      showInput: true,
      chooseText: "Apply",
      cancelText: "Cancel",
      change: function(color) {
        var hexColor = color.toHexString();

        _editor.composer.commands.exec(options.command, hexColor, [{
          name: options.attribute,
          value: hexColor
        }]);
      },
    });
  }

  function _bind() {
    $("#save").on("click", function() {
      _getSettings();
    });

    $("#cancel, #close").on("click", function() {
      gadgets.rpc.call("", "rscmd_closeSettings", null);
    });

    $("#help").on("click", function() {
      window.open(HELP_URL, "_blank");
    });

    // Font picker
    $($_fontPicker.data("plugin_fontPicker"))
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

        $_editable.focus();
      })
      .on("googleFontSelected", function(e, font) {
        _editor.composer.commands.exec("googleFont", font, [{
          name: "data-google-font",
          value: font
        }]);

        $_editable.focus();
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

        $_editable.focus();
      });

    // Font size picker
    $($_fontSizePicker.data("plugin_fontSizePicker"))
      .on("change.bfhselectbox", function() {
        _editor.composer.commands.exec("fontSize",
          $(this).find(".bfh-fontsizes").val());
      });

    // When the user clicks in the editor, set toolbar to match text styles.
    $(".wysihtml5-sandbox").contents().find("body").on("click", function() {
      var font = "", fontSize = "";
      var color = "", highlightColor = "";
      var node = null, parentNode = null;

      // Hide color pickers.
      $_textColor.spectrum("hide");
      $_highlightColor.spectrum("hide");
      $_backgroundColor.spectrum("hide");

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
                $_fontPicker.data("plugin_fontPicker").setFont(font);
              }

              if (fontSize) {
                $_fontSizePicker.data("plugin_fontSizePicker")
                  .setFontSize(fontSize);
              }

              if (color) {
                $_textColor.spectrum("set", color);
              }

              if (highlightColor) {
                $_highlightColor.spectrum("set", highlightColor);
              }
            }
          }
        }
      }
    });
  }

  function init() {
    // Configure editor toolbar.
    $_editable.wysihtml5({
      "toolbar": {
        "text-color":
           "<li>" +
            "<input id='text-color' type='color'>" +
          "</li>",
        "highlight-color":
           "<li>" +
            "<input id='highlight-color' type='color'>" +
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
        "background-color":
           "<li>" +
            "<input id='background-color' type='color'>" +
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

    _editor = $_editable.data("wysihtml5").editor;
    $_fontPicker = $(".font-picker");
    $_fontSizePicker = $(".font-size-picker");
    $_textColor = $("#text-color");
    $_highlightColor = $("#highlight-color");
    $_backgroundColor = $("#background-color");

    // Configure the font picker.
    $_fontPicker.fontPicker({
      "contentDocument": _editor.composer.iframe.contentDocument
    });

    // Configure the font size picker.
    $_fontSizePicker.fontSizePicker();

    // Configure the color pickers.
    _configureColorPicker({
      elem: $_textColor,
      type: "text",
      color: "#000",
      command: "textColor",
      attribute: "data-text-color"
    });

    _configureColorPicker({
      elem: $_highlightColor,
      type: "background",
      color: "transparent",
      command: "highlightColor",
      attribute: "data-highlight-color"
    });

    _configureColorPicker({
      elem: $_backgroundColor,
      type: "background",
      color: "#fff",
      command: "backgroundColor",
      attribute: "data-background-color"
    });

    _bind();

    $(".alert").hide();

    // Request additional parameters from the Viewer.
    gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {
      var prefs = new gadgets.Prefs();
      var util = RiseVision.Common.Utilities;
      var standardFont, googleFont, customFont;
      var textColor, highlightColor, backgroundColor;

      // Settings have been saved before.
      if (result) {
        result = JSON.parse(result);

        _editor.setValue(result.data);

        backgroundColor = result["background-color"];

        if (backgroundColor) {
          $_backgroundColor.spectrum("set", backgroundColor);
          _editor.composer.commands.exec("backgroundColor", backgroundColor, [{
            name: "data-background-color",
            value: backgroundColor
          }]);
        }

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
            $_fontPicker.data("plugin_fontPicker")
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

      i18n.init(function(t) {
        $(".widget-wrapper").i18n().show();

        // Set buttons to be sticky only after wrapper is visible.
        $(".buttons").sticky({
          container : $("#wrapper"),
          topSpacing : 41
        });
      });
    });
  }

  return {
    init: init
  };
})($, gadgets);