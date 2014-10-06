/* global RiseVision, gadgets */

(function (window, gadgets) {
  "use strict";

  var prefs = new gadgets.Prefs();
  var id = prefs.getString("id");

  function play() {
    RiseVision.Text.play();
  }

  function pause() {
    RiseVision.Text.pause();
  }

  function stop() {
    RiseVision.Text.stop();
  }

  // Get additional parameters.
  if (id) {
    gadgets.rpc.register("rscmd_play_" + id, play);
    gadgets.rpc.register("rscmd_pause_" + id, pause);
    gadgets.rpc.register("rscmd_stop_" + id, stop);

    gadgets.rpc.register("rsparam_set_" + id, RiseVision.Text.getAdditionalParams);
    gadgets.rpc.call("", "rsparam_get", null, id, "additionalParams");
  }


  // TODO: Enable once development complete.
  // window.oncontextmenu = function () {
  //   return false;
  // };
})(window, gadgets);
