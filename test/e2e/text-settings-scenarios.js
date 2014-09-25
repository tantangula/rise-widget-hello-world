/* jshint expr: true */
/* global element: false, browser: false, by: false */

(function () {
  "use strict";

  var expect;
  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var FONT_PICKER_COUNT = 48;
  var FONT_SIZE_PICKER_COUNT = 14;
  var LINE_HEIGHT_COUNT = 4;

  chai.use(chaiAsPromised);
  expect = chai.expect;

  browser.driver.manage().window().setSize(1024, 768);

  describe("Text Widget Settings", function() {
    beforeEach(function () {
      browser.get("/src/settings-e2e.html");
    });

    it("Should load scroll component", function () {
      expect(element(by.id("scroll-by")).isPresent()).
        to.eventually.be.true;

      expect(element(by.id("scroll-by")).getAttribute("value"))
        .to.eventually.equal("none");
    });

    it("Should load clear button", function () {
      expect(element(by.css(".clear")).isPresent()).to.eventually.be.true;
    });

    it("Should load font styles", function () {
      expect(element(by.css(".emphasis .bold")).isPresent())
        .to.eventually.be.true;

      expect(element(by.css(".emphasis .italic")).isPresent())
        .to.eventually.be.true;

      expect(element(by.css(".emphasis .underline")).isPresent())
        .to.eventually.be.true;

      expect(element(by.css(".emphasis .wysihtml5-command-active")).isPresent())
        .to.eventually.be.false;
    });

    it("Should load alignment component", function () {
      expect(element(by.css(".btn-alignment .fa-align-left"))
        .isPresent()).to.eventually.be.true;

      expect(element(by.css(
        ".btn-alignment[data-wysihtml5-command-value='left']")).isPresent())
        .to.eventually.be.true;
    });

    it("Should load font picker", function () {
      expect(element(by.css(".font-picker .bfh-selectbox"))
        .isPresent()).to.eventually.be.true;

      expect(element(by.css(".font-picker .google-fonts"))
        .isPresent()).to.eventually.be.true;

      expect(element(by.css(".font-picker .custom-font"))
        .isPresent()).to.eventually.be.true;

      expect(element(by.css(".font-picker .google-fonts"))
        .isDisplayed()).to.eventually.be.false;

      expect(element(by.css(".font-picker .custom-font"))
        .isDisplayed()).to.eventually.be.false;

      expect(element.all(by.css(".font-picker .bfh-selectbox ul li"))
        .count()).to.eventually.equal(FONT_PICKER_COUNT);
    });

    it("Should load font size picker", function () {
      expect(element(by.css(".font-size-picker .bfh-fontsizes"))
        .isPresent()).to.eventually.be.true;

      expect(element.all(by.css(".font-size-picker .bfh-fontsizes ul li"))
        .count()).to.eventually.equal(FONT_SIZE_PICKER_COUNT);
    });

    it("Should load line height", function () {
      expect(element(by.css(".line-height")).isPresent()).to.eventually.be.true;

      expect(element.all(by.css(".line-height ul li")).count())
        .to.eventually.equal(LINE_HEIGHT_COUNT);
    });

    it("Should load text colour", function () {
      expect(element(by.css(".text-color")).getCssValue("display")).
        to.eventually.equal("none");

      expect(element(by.css(".text-color-picker")).isPresent()).
        to.eventually.be.true;
    });

    it("Should load highlight colour", function () {
      expect(element(by.css(".highlight-color")).getCssValue("display")).
        to.eventually.equal("none");

      expect(element(by.css(".highlight-color-picker")).isPresent()).
        to.eventually.be.true;
    });

    it("Should load background colour", function () {
      expect(element(by.css(".background-color")).getCssValue("display")).
        to.eventually.equal("none");

      expect(element(by.css(".background-color-picker")).isPresent()).
        to.eventually.be.true;
    });

    it("Should correctly save settings", function() {
      var settings = {
        "params": {},
        "additionalParams": {
          "data": "",
          "background": "",
          "scroll": {
            "by": "none",
            "speed": "medium",
            "pause": "5"
          }
        }
      };

      element(by.id("save")).click();

      expect(browser.executeScript("return window.result")).to.eventually.deep.equal({
        "additionalParams": JSON.stringify(settings.additionalParams),
        "params": "?"
      });
    });
  });
})();
