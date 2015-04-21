# Hello World Widget

##Introduction

This widget is meant to be a starting point for anyone who wants to start building widgets for [Rise Vision's](http://www.risevision.com) digital signage system. I started by looking at the [widget-text](https://github.com/Rise-Vision/widget-text) widget written by [Donna Peplinskie](https://github.com/donnapep), and I took out everything that wasn't essential for a simple "Hello World" style widget. This widget only has a single text input field on the settings page that saves a string and sends it to an h2 tag in the widget. 

Disclaimer: I don't work for Rise Vision, and I only started looking into how these widgets work a week ago. This is a hack and slash job done on code I am still learning about. Because I don't know what I'm doing, the widget will generate some errors when you try to build it, but it will work just fine if you host all of the files from the gulp build on a web server and link to them from within a gadget created using the Rise Vision [dashboard](http://rva.risevision.com/).

##Widget Development Environment 

To get your widget into the Rise Vision system and onto a display, you will ultimately have to build the widget and host it on somewhere on the web. Then, you'll be able to link to the settings.html and widget.html pages using their url's. But if you just want to test your widget locally before going through the trouble of setting up hosting, Rise Vision has developed a [widget preview app](http://192.254.220.36/~rvi/widget-preview/) using [NWjs](http://nwjs.io/) that will let you see how your widget is going to work.

To use the preview app, you'll need to have [NWjs](http://dl.nwjs.io/v0.12.1/) installed somewhere on your computer. Then, you will need to download the latest [preview app](http://192.254.220.36/~rvi/widget-preview/) from Rise Vision, and run the app using the NWjs runtime. I'm using Ubuntu 14.04 with the NWjs binary mapped to the alias "nw." So for me to start the app, I navigate to the folder containing the preview app and run the following command...

```
nw rv-widget-dev-app
```

This will open up an app that will allow you to set the settings.html and widget.html pages of the widget you want to look at. Then, you can open up two tabs in your browser and copy and paste the url's to see the two pages. At this point, your pages are linked, and you can set your settings, save them, and refresh your widget page to see the changes you've made.
