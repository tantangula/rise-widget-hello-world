/* global gadgets:false */

var RiseVision = RiseVision || {};
RiseVision.HelloWorld = {};

RiseVision.HelloWorld = (function(gadgets) {
  "use strict";

  var prefs = new gadgets.Prefs();

  /*
   *  Private Methods
   */
   
  function ready() {
    gadgets.rpc.call("", "rsevent_ready", null, prefs.getString("id"), true,
      true, true, true, true);
  }

  /*
   *  Public Methods
   */
   
  function getAdditionalParams(name, value) {
    if (name === "additionalParams" && value) {
	  //This is where the settings data is parsed, and made ready to use.
      var params = JSON.parse(value);
      //What we initially stored as "settings.additionalParams.message" becomes "params.message" by way of voodoo.
      var title = params.message;
      
      document.getElementById("message").innerHTML = title;
    }

    ready();
  }

  return {
    getAdditionalParams: getAdditionalParams
  };
})(gadgets);
