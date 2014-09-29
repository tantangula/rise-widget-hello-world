angular.module("risevision.widget.text.settings")
  .controller("textSettingsController", ["$scope", "stylesheets",
    function ($scope, stylesheets) {
      $scope.stylesheets = [stylesheets];
    }
  ])
  .value("defaultSettings", {
    "params": {},
    "additionalParams": {
      "data": "",
      "background": "",
      "scroll": {}
    }
  });
