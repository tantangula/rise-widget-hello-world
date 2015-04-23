# Hello World Widget

##Introduction

This widget is meant to be a starting point for anyone who wants to start building widgets for [Rise Vision's](http://www.risevision.com) digital signage system. I started by looking at the [widget-text](https://github.com/Rise-Vision/widget-text) widget written by [Donna Peplinskie](https://github.com/donnapep), and I took out everything that wasn't essential for a simple "Hello World" style widget. This widget only has a single text input field on the settings page that saves a string and then sends it to an h2 tag in the widget. 

I've included comments in the code about how I added the message input and how I am using it to pass a value to the widget. By looking through the code and reading the comments, you should be able to add your own input fields to the settings interface and pull their data into your widget the same way.

Disclaimer: I don't work for Rise Vision, and I only started looking into how these widgets work a week ago. This is a hack and slash job done on code I am still learning about. Because I don't know what I'm doing, the widget will generate some errors when you try to build it, but it will work just fine if you host all of the files from the gulp build on a web server and link to them from within a gadget created using the Rise Vision [dashboard](http://rva.risevision.com/).

##Building This Widget

To build these widgets you have to install the following:

- [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js and npm](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
- [Bower](http://bower.io/#install-bower) - To install Bower, run the following command in Terminal: `npm install -g bower`. Should you encounter any errors, try running the following command instead: `sudo npm install -g bower`.
- [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) - To install Gulp, run the following command in Terminal: `npm install -g gulp`. Should you encounter any errors, try running the following command instead: `sudo npm install -g gulp`.

The Widget can now be built by executing the following commands in Terminal:
```
git clone https://github.com/tantangula/widget-hello-world.git
cd widget-hello-world
npm install
bower install
gulp build 
```

The errors I was talking about earlier will happen when you get to "gulp build"

Now that the widget is built, you can use the widget by either hosting the widget folder on a server and creating a custom gadget in the Rise Vision dashboard or by using the Rise Vision preview app described below.

##Widget Development Environment 

To get your widget into the Rise Vision system and onto a display, you will ultimately have to build the widget and host it somewhere on the web. Then, you'll be able to link to the settings.html and widget.html pages using their url's. But if you just want to test your widget locally before going through the trouble of setting up hosting, Rise Vision has developed a [widget preview app](http://192.254.220.36/~rvi/widget-preview/) using [NWjs](http://nwjs.io/) that will let you see how your widget is going to work.

To use this preview app, you'll need to have [NWjs](http://dl.nwjs.io/v0.12.1/) installed somewhere on your computer.* Then, you will need to download the latest [preview app](http://192.254.220.36/~rvi/widget-preview/) from Rise Vision and run the app using the NWjs runtime. I'm using Ubuntu 14.04 with the NWjs binary mapped to the alias "nw." So for me to start the app, I navigate to the folder containing the preview app and run the following command...

```
nw rv-widget-dev-app
```

This will open up an app that will allow you to set the settings.html and widget.html pages of the widget you want to look at. Then, you can open up two tabs in your browser and copy and paste the url's to see the two pages. At this point, your pages are linked, and you can set your settings, save them, and refresh your widget page to see your changes.

##Now What?

So now that you have the settings page open, you can input some text, save it, and refresh your widget page to see that your text has been passed to you widget. From here, you can add new fields to your settings.html page in your "src" folder and pass them to your widget.html page in the same folder to build anything you want. 

##*Installing NWjs

NWjs is a really cool project that enables developers to write apps using HTML, CSS, and Javascript and then, launch them using the NWjs runtime. The runtime is actually just an instance of the [Chromium](https://www.chromium.org/) web browser that allows you to run [Node.js](https://nodejs.org/) modules. So I am assuming that the preview app is using a Node module to create the local server that hosts the widget and then builds the interface with HTML and CSS, but anyway....

Depending on what type of system you're developing on, how you install NWjs may be completely different than how I have it installed. What I am doing above is essentially running the NWjs binary and giving it the location of the preview app as the first argument, and on my system, that works. However, I showed this README to one of my coworkers to see if she could get the widget up and running in the preview app without any prior knowledge of how the code works, and hers didn't work the same way. She was kind enough to take notes on her adventure though, and here they are...

##Wendi's Quest

Wendi used an Ubuntu 12.04 image running in Virtualbox. These are the steps she took to build the widget, install NWjs, and launch the Rise Vision preview app.

```
sudo apt-get update
sudo apt-get install git
sudo apt-get install nodejs
sudo apt-get install npm
```

All of the above completed successfully

```
npm install -g bower
Error: No compatible version found: bower
```

She found a stack overflow [question](http://stackoverflow.com/questions/12913141/message-failed-to-fetch-from-registry-while-trying-to-install-any-module) that helped her figure out the next few commands...

```
sudo apt-get purge nodejs npm
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
```

Then, she tried it again.

```
sudo npm install -g bower
sudo npm install -g gulp
```

At this point she had everything she needed to build the widget. The next step is to actually build it.

```
git clone https://github.com/tantangula/widget-hello-world.git
cd widget-hello-world
npm install           **** Needed sudo   phantomjs reference??
bower install
```


Now, the widget is built and ready to be opened with the Rise Vision preview app, so she downloaded NWjs and extracted it.

```
tar -xvzf FILENAME
```

She downloaded the widget viewer and extracted it.

```
unzip file.zip
```

She navigated to nw and tried to run it. It gave her a message that said it wasn't installed, but the error suggested that she try the following command to see if that would get it up and running...

```
sudo apt-get install netrw
```
...and it did. Next she navigated to the preview app folder and ran the following...

```
nw rv-widget-dev-app
```

... but this didnt work. It just kept displaying settings. So, she just navigated to preview app directory and ran...

```
./rv-widget-dev-app
```

At this point, the preview app was up and running. Then, she loaded in the settings.html and widget.html files from the "src" folder and opened up Chrome.
