angular.module("risevision.widget.text.settings")
  .controller("textSettingsController", ["$scope",
    function ($scope) {
      $scope.stylesheets = ["css/editor.min.css"];
    }
  ])
  .value("defaultSettings", {
    params: {},
    additionalParams: {
      data: {}
    }
  });
