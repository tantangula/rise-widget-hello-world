/* global gadgets, i18n */

var RiseVision = RiseVision || {};
RiseVision.Text = {};
RiseVision.Text.Settings = {};

RiseVision.Text.Settings = (function($, gadgets) {
  "use strict";

  var _editor = null;
  var $_editable = $("#editable");
  var $_fontStyle, $_fontPicker, $_fontSizePicker;
  var $_textColor, $_highlightColor, $_backgroundColor;
  var FONT_SIZE_PICKER_STYLESHEET =
    "//s3.amazonaws.com/rise-components/bootstrap-form-components/0.1.8/dist/css/all.min.css";
  var LINE_HEIGHT_STYLESHEET =
    "//s3.amazonaws.com/rise-components/rv-bootstrap3-wysihtml5/0.0.3/dist/css/bootstrap3-wysihtml5-line-height.min.css";
  var ALIGNMENT_STYLESHEET =
    "//s3.amazonaws.com/rise-components/common-style/css/alignment.min.css";

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

  function _bind() {
    $(".font-picker").on("show.bfhselectbox", function() {
      _closeDropdowns();
    });

    $(".font-size-picker, .line-height, .alignment").on("show.bs.dropdown", function() {
      _closeDropdowns();
    });

    $(".text-color, .highlight-color, .background-color").on("beforeShow", function() {
      _closeDropdowns();
    });

    $("#save").on("click", function() {
      _getSettings();
    });

    $("#cancel, .close, .widget-overlay").on("click", function() {
      gadgets.rpc.call("", "rscmd_closeSettings", null);
    });

    // When the user clicks in the editor, set toolbar to match text styles.
    $(".wysihtml5-sandbox").contents().find("body").on("click", function() {
      var node = null, parentNode = null;
      var isBold = false, isItalic = false, isUnderline = false;
      var font = "", fontSize = "", lineHeight = "";
      var color = "", highlightColor = "";

      _closeDropdowns();

      node = _editor.composer.selection.getSelectedNode();

      if (node) {
        // This is a text node.
        if (node.nodeType === 3) {
          parentNode = node.parentNode;

          // The parent node is an element.
          if (parentNode && parentNode.nodeType === 1) {
            // The parent node is not the editor element itself.
            if (parentNode.tagName.toLowerCase() !== "body") {
              // Font Style
              isBold = window.getComputedStyle(parentNode, null)
                .getPropertyValue("font-weight") === "bold" ? true : false;
              isItalic = window.getComputedStyle(parentNode, null)
                .getPropertyValue("font-style") === "italic" ? true : false;
              isUnderline = window.getComputedStyle(parentNode, null)
                .getPropertyValue("text-decoration").indexOf("underline") !== -1 ? true : false;

              $_fontStyle.data("plugin_fontStyle").setStyles({
                "bold": isBold,
                "italic": isItalic,
                "underline": isUnderline
              });

              // Font
              font = window.getComputedStyle(parentNode, null)
                .getPropertyValue("font-family");

              if (font) {
                $_fontPicker.data("plugin_fontPicker").setFont(font);
              }

              // Font size
              fontSize = window.getComputedStyle(parentNode, null)
                .getPropertyValue("font-size");

              if (fontSize) {
                $_fontSizePicker.data("plugin_fontSizePicker")
                  .setFontSize(fontSize);
              }

              // Line Height
              lineHeight = $(parentNode).data("line-height");

              if (lineHeight) {
                $(".line-height button").data("wysihtml5-command-value", lineHeight);
              }

              // Colors
              color = window.getComputedStyle(parentNode, null)
                .getPropertyValue("color");
              highlightColor = window.getComputedStyle(parentNode, null)
                .getPropertyValue("background-color");

              if (color) {
                $_textColor.spectrum("set", color);
              }

              if (highlightColor) {
                $_highlightColor.spectrum("set", highlightColor);
              }
            }
            else {
              $_fontStyle.data("plugin_fontStyle").setStyles({
                "bold": false,
                "italic": false,
                "underline": false
              });
            }
          }
        }
      }
    });
  }

  // Close all open dropdowns.
  function _closeDropdowns() {
    $(".open.alignment, .font-picker .open.bfh-selectbox, " +
      ".font-size-picker .open.bfh-fontsizes, .open.line-height")
      .removeClass("open");
    $_textColor.spectrum("hide");
    $_highlightColor.spectrum("hide");
    $_backgroundColor.spectrum("hide");
  }

  function init() {
    // Configure editor toolbar.
    $_editable.wysihtml5({
      "font-styles": false,
      "lists": false,
      "link": false,
      "image": false,
      "stylesheets": [FONT_SIZE_PICKER_STYLESHEET, LINE_HEIGHT_STYLESHEET,
        ALIGNMENT_STYLESHEET],
    });

    _editor = $_editable.data("wysihtml5").editor;
    $_fontStyle = $(".emphasis");
    $_fontPicker = $(".font-picker");
    $_fontSizePicker = $(".font-size-picker");
    $_textColor = $(".text-color");
    $_highlightColor = $(".highlight-color");
    $_backgroundColor = $(".background-color");

    _bind();

    $(".alert").hide();

    // Request additional parameters from the Viewer.
    gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {
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

        $.each($(result.data).find("span").andSelf(), function() {
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

      i18n.init(function() {
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
