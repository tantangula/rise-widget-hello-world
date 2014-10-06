/* global gadgets:false */

var RiseVision = RiseVision || {};
RiseVision.Text = {};

RiseVision.Text.Controller = (function(gadgets) {
  "use strict";

  var id = "";
  var utils = RiseVision.Common.Utilities;

  /*
   *  Private Methods
   */
  function getAdditionalParams(name, value) {
    if (name === "additionalParams" && value) {
      var params = JSON.parse(value);

      var data = params.data;

      $("#container").css("background-color", params.background || "transparent");
      $(".page").html(data);

      // Load custom and Google fonts.
      $.each($(data).find("span").andBack(), function() {
        var googleFont = $(this).attr("data-google-font");
        var customFont = $(this).attr("data-custom-font");
        var rules = [];

        if (googleFont) {
          utils.loadGoogleFont(googleFont);

          // Add CSS for the Google font plus a fallback.
          rules.push(".wysiwyg-font-family-" + googleFont.replace(/ /g, "-")
            .toLowerCase() + " { font-family: '" + googleFont + "', serif; }");
        }

        if (customFont) {
          utils.loadCustomFont(customFont, $(this).attr("data-custom-font-url"));

          // Add CSS for the custom font plus a fallback.
          rules.push(".wysiwyg-font-family-" + customFont.replace(/ /g, "-")
            .toLowerCase() + " { font-family: '" + customFont + "', serif; }");
        }

        utils.addCSSRules(rules);
      });

      $("#container").autoScroll(params.scroll)
      .on("done", function() {
        doneEvent();
      });
    }

    readyEvent();
  }

  function readyEvent() {
    gadgets.rpc.call("", "rsevent_ready", null, id, true, true, true, true,
      true);
  }

  function play() {
    $("#container").data("plugin_autoScroll").play();
  }

  function pause() {
    $("#container").data("plugin_autoScroll").pause();
  }

  function stop() {
    pause();
  }

  function doneEvent() {
    gadgets.rpc.call("", "rsevent_done", null, id);
  }

  /*
   *  Public Methods
   */
  function init() {   // jshint ignore:line
    var prefs = new gadgets.Prefs();
    var background = prefs.getString("background");

    id = prefs.getString("id");

    if (background) {
      document.body.style.background = background;
    }

    // Get additional parameters.
    if (id) {
      gadgets.rpc.register("rscmd_play_" + id, play);
      gadgets.rpc.register("rscmd_pause_" + id, pause);
      gadgets.rpc.register("rscmd_stop_" + id, stop);

      gadgets.rpc.register("rsparam_set_" + id, getAdditionalParams);
      gadgets.rpc.call("", "rsparam_get", null, id, "additionalParams");
    }
  }

  return {
    init: init
  };
})(gadgets);

// TODO: Add Analytics code.

// TODO: Enable once development complete.
// No right clicks.
// window.oncontextmenu = function() {
//   return false;
// };

RiseVision.Text.Controller.init();
