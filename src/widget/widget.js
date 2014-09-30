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

      $("#container").html(data);
    }

    readyEvent();
  }

  function readyEvent() {
    gadgets.rpc.call("", "rsevent_ready", null, id, false, false, false, true,
      false);
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
