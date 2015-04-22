/* global RiseVision, gadgets */

(function (window, gadgets) {
  "use strict";

  var prefs = new gadgets.Prefs();
  var id = prefs.getString("id");

  // Get additional parameters.
  if (id) {
    gadgets.rpc.register("rsparam_set_" + id, RiseVision.HelloWorld.getAdditionalParams);
    gadgets.rpc.call("", "rsparam_get", null, id, "additionalParams");
  }

  window.oncontextmenu = function () {
    return false;
  };
})(window, gadgets);
