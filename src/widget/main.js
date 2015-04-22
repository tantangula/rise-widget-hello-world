/* global RiseVision, gadgets */

(function (window, gadgets) {
  "use strict";

  var prefs = new gadgets.Prefs();
  var id = prefs.getString("id");

  /* This is where the Angular model data created by the settings interface is pulled into the widget.
   * It's a mystery to me how this works.*/
  if (id) {
    gadgets.rpc.register("rsparam_set_" + id, RiseVision.HelloWorld.getAdditionalParams);
    gadgets.rpc.call("", "rsparam_get", null, id, "additionalParams");
  }

  window.oncontextmenu = function () {
    return false;
  };
})(window, gadgets);
