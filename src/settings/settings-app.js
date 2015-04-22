/*If you want to use any of Rise Vision's prebuilt settings components (like a save button, a title translator, a color picker or 
 * a url field with built-in validation,) you need to tell Angular about them here.
 * When you are adding these components, you may have to do some configuring using the config files in the /src/config folder,
 * but I haven't figured out exactly how those work yet.*/
angular.module("risevision.widget.hello.world.settings", [
  "risevision.common.i18n",
  "risevision.widget.common",
  "risevision.widget.common.widget-button-toolbar"
]);
