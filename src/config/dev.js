"use strict";

angular.module("risevision.widget.text.config", [])
  .constant("stylesheets", "../dist/css/editor.min.css");

angular.module("risevision.common.i18n.config", [])
  .constant("LOCALES_PREFIX",
    "components/rv-common-i18n/dist/locales/translation_")
  .constant("LOCALES_SUFIX", ".json");
