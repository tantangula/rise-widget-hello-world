/* jshint node: true */

(function () {
  "use strict";

  var gulp = require("gulp");
  var fs = require("fs");
  var es = require("event-stream");
  var clean = require("gulp-clean");
  var bump = require("gulp-bump");
  var jshint = require("gulp-jshint");
  var jsoncombine = require("gulp-jsoncombine");
  var minifyCSS = require("gulp-minify-css");
  var usemin = require("gulp-usemin");
  var uglify = require("gulp-uglify");
  var runSequence = require("gulp-run-sequence");
  var path = require("path");
  var rename = require("gulp-rename");

  var cssFiles = [
    "src/css/**/*.css"
  ];

  var jsFiles = [
    "src/js/**/*.js"
  ];

  var languages = fs.readdirSync("src/locales")
    .filter(function(file) {
      return fs.statSync(path.join("src/locales", file)).isDirectory();
  });

  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
      .pipe(bump({ type:"patch" }))
      .pipe(gulp.dest("./"));
  });

  gulp.task("clean", function() {
    return gulp.src("dist", { read: false })
      .pipe(clean({ force: true }));
  });

  gulp.task("lint", function() {
    return gulp.src(jsFiles)
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"));
      // .pipe(jshint.reporter("fail"));
  });

  gulp.task("html", ["lint"], function () {
    return gulp.src(["./src/*.html"])
      .pipe(usemin({
        js: [uglify({ mangle:false, outSourceMap: true })] //disable mangle just for $routeProvider in controllers.js
      }))
      .pipe(gulp.dest("dist/"));
  });

  gulp.task("css", function () {
    return gulp.src(cssFiles)
      .pipe(minifyCSS({ keepBreaks:true }))
      .pipe(rename(function(path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest("dist/css"));
  });

  gulp.task("js", function () {
    return gulp.src(jsFiles)
      .pipe(uglify())
      .pipe(rename(function(path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest("dist/js"));
  });

  gulp.task("fonts", function() {
    return gulp.src("src/components/style-guide/dist/fonts/**/*")
      .pipe(gulp.dest("dist/fonts"));
  });

  gulp.task("json-move", function() {
    // in case some files have the same name
    var index = 0;
    var tasks = languages.map(function(folder) {
      return gulp.src([path.join("src/locales", folder, "*.json"),
        path.join("src/components/*/dist/locales", folder, "*.json")])
        .pipe(rename(function (path) {
          path.dirname = "";
          path.basename += index++;
        }))
        .pipe(gulp.dest(path.join("tmp/locales", folder)));
    });
    return es.concat.apply(null, tasks);
  });

  gulp.task("json-combine", ["json-move"], function() {
    var tasks = languages.map(function(folder) {
      return gulp.src([path.join("tmp/locales", folder, "*.json")])
        .pipe(jsoncombine("translation.json",function(data) {
          var jsonString,
            newData = {};

          for (var filename in data) {
            var fileObject = data[filename];
            for (var attrname in fileObject) {
              newData[attrname] = fileObject[attrname];
            }
          }

          jsonString = JSON.stringify(newData, null, 2);
          return new Buffer(jsonString);
        }))
        .pipe(gulp.dest(path.join("dist/locales/", folder)));
    });
    return es.concat.apply(null, tasks);
  });

  gulp.task("i18n", function(cb) {
    runSequence("json-move", "json-combine", cb);
  });

  gulp.task("build", function (cb) {
      runSequence(["clean"], ["html", "css", "js", "fonts", "i18n"], cb);
  });

  gulp.task("default", function(cb) {
    runSequence("build", cb);
  });
})();
