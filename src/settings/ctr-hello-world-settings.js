angular.module("risevision.widget.hello.world.settings")
  .controller("helloWorldSettingsController", ["$scope",
    function ($scope) {
		/*When a Controller is attached to the DOM via the ng-controller directive, Angular will instantiate a new Controller object, 
		 * using the specified Controller's constructor function (this function.) A new child scope will be available as an injectable parameter to the 
		 * Controller's constructor function as $scope.

		 * Use controllers to:

		 * 	Set up the initial state of the $scope object.
		 *	Add behavior to the $scope object.*/
    }
  ])
  // This is where we set the default values for our Widget's settings. When you add new settings to the Widget model you can give them default values here.
  .value("defaultSettings", {
    "params": {},
    "additionalParams": {
      "message": ""
    }
  });
