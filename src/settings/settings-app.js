angular.module("risevision.widget.text.settings", [
  "risevision.widget.text.config",
  "risevision.widget.common",
  "risevision.widget.common.translate",
  "risevision.widget.common.scroll-setting",
  "risevision.widget.common.tooltip",
  "risevision.widget.common.wysihtml5"
]);

angular.module("risevision.widget.common.translate", ["pascalprecht.translate"])
  .config(["$translateProvider", function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: "locales/",
      suffix: "/translation.json"
    });
    $translateProvider.determinePreferredLanguage();

    if ($translateProvider.preferredLanguage().indexOf("en_") === 0){
      $translateProvider.preferredLanguage("en");
    }
  }]);
