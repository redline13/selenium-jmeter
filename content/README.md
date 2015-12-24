FireFox+Selenium+JMeter+RedLine13 Plugin 
-----------------------------------------

### Goal
Run a recorded selenium test and capture as a JMeter Performance Test Plan.  Then scale out testing. 
Turns out everything plugins with each other pretty well. 
1 - Read every page on [], which points you to learning FF extensions
2 - Learn about FF extensions and how to intercept HTTP traffic

### User Documentation 
Usage Documentation : [REDLINE13 LINK]

### Extending 
The piece to write-to JMeter is separate from capturing traffic.  It is possible to implement new writers. 
This is not drop-in pluggable (future) but not too hard either. 
1 - content/library/listener.js update saveTo(...) add case 'YOUR TYPE': and call your method
1 - create content/library/selenium-YOUR_TYPE.js
3 - In YOUR_TYPE pass yourself the recorder and preferences you want.  Return the STRING for your file contents.
```
var visualizer = preferences.getBoolPref('visualizer');
var jmx = saveToJMeter(redline13Recorder, visualizer);
```
4 - Understand how to walk the redline13Recorder.results and build your output ( see selenium-jmeter.js )
5 - Any extra files you need put them into content/library/YOUR_TYPE/****.js
6 - Add them to content/view/sidebarToolbarOverlay.xul and content/view/toolbarOverlay.xul in <script tags

[BLOG REDLINE13 Implementing JMeter + Selenium + FF Plugin]

### Building
npm install 
gulp watch - For development constantly watches source files and builds distribution 
gulp build - create ./build and directory structure, copy over contents
gulp package - create .xpi 
gulp  - default is build, package

### Support 
Community use git-hub issues or fork and send over pull requests
Need user support or custom features please visit redline13.com or email rich@redline13.com
