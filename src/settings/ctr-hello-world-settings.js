angular.module("risevision.widget.hello.world.settings")
  .controller("helloWorldSettingsController", ["$scope",
    function ($scope) {
    }
  ])
  .value("defaultSettings", {
    "params": {},
    "additionalParams": {
      "message": ""
    }
  });
