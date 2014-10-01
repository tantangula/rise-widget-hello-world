/* global gadgets:false */

var RiseVision = RiseVision || {};
RiseVision.Text = {};

RiseVision.Text.Controller = (function(gadgets) {
  "use strict";

  var id = "";

  /*
   *  Private Methods
   */
  function getAdditionalParams(name, value) {
    if (name === "additionalParams" && value) {
      value = JSON.parse(value);

      var data = value.data;

      $(".page").html(data);

      $("#container").autoScroll({
        scrollBy: value.scroll.by,
        scrollSpeed: value.scroll.speed,
        scrollResumes: value.scroll.pause
      })
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
