/* global gadgets:false */

var RiseVision = RiseVision || {};
RiseVision.Text = {};

RiseVision.Text = (function(gadgets) {
  "use strict";

  var prefs = new gadgets.Prefs();
  var utils = RiseVision.Common.Utilities;

  /*
   *  Private Methods
   */
  function ready() {
    gadgets.rpc.call("", "rsevent_ready", null, prefs.getString("id"), true,
      true, true, true, true);
  }

  function done() {
    gadgets.rpc.call("", "rsevent_done", null, prefs.getString("id"));
  }

  /*
   *  Public Methods
   */
  function getAdditionalParams(name, value) {
    if (name === "additionalParams" && value) {
      var params = JSON.parse(value);
      var data = params.data;
      var googleFont = "", customFont = "";
      var rules = [];

      // Set height of container to that of Placeholder so that scrolling works.
      $("#container").height(prefs.getInt("rsH"))
        .css("background-color", params.background || "transparent");
      $(".page").width(prefs.getInt("rsW")).html(data);

      // Load custom and Google fonts.
      $.each($(data).find("span").addBack(), function() {
        googleFont = $(this).attr("data-google-font");
        customFont = $(this).attr("data-custom-font");

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
      });

      utils.addCSSRules(rules);

      $("#container").autoScroll(params.scroll)
      .on("done", function() {
        done();
      });
    }

    ready();
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

  return {
    getAdditionalParams: getAdditionalParams,
    play               : play,
    pause              : pause,
    stop               : stop
  };
})(gadgets);
