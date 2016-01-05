# selenium-jmeter
SeleniumIDE Plugin To Capture a JMeter Load Test

# About this Add-on

Selenium-IDE Plugin to record web traffic and create Performance Test for JMeter.

Playback your selenium test-case while recording a performance test in JMeter. The output of this plugin is a standard JMeter .jmx file which be used directly inside JMeter or run at scale on RedLine13.

* Current Options Supported include
* Includes: limit sites which get recorded
* Excludes: excludes patterns from being recorded, ie. images
* Maximum Requests: Limit number of requests recorded
* Visualizer: Enable JMeter Visualizer

# Resources 
* Firefox Plugin [https://addons.mozilla.org/en-US/firefox/addon/jmeter/]
* Tutorial [https://www.redline13.com/blog/selenium-jmeter-plugin-tutorial]

# Building Plugin
```
npm install
gulp build
gulp package
```
