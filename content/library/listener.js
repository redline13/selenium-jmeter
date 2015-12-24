var redline13Recorder = null;

function toggleJMeterRecording() {
	try {
		var preferences = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("extensions.selenium-ide.jmeter.");		
		var obj = {};
		
		var cl = document.getElementById('jmeter-button').classList;
		if (redline13Recorder === null) {
			var includem = preferences.getCharPref('includem');
			var excludem = preferences.getCharPref('excludem');
			var maxrequests = preferences.getIntPref('maxrequests');

			cl.add('recording');
			redline13Recorder = new HttpRecorder(includem,excludem,maxrequests);
			redline13Recorder.start();
			
		} else {
			cl.remove('recording');
			redline13Recorder.stop();

			saveTo(preferences, redline13Recorder);
			delete redline13Recorder;
			redline13Recorder = null;
		}
	} catch (e){
		window.alert( "Apologies, but an exception is about to escape: " + e );
		console.log( e );
	}
}

function saveTo( preferences, redline13Recorder ){
	
	if ( redline13Recorder.requests.length > 0 ){
		var format = preferences.getCharPref('format');
		switch( format ){
			case 'jmeter':
			default:
				var visualizer = preferences.getBoolPref('visualizer');
				var jmx = saveToJMeter(redline13Recorder, visualizer);
				writeTo( jmx, 'Save JMeter Performance', 'RedLine13-Generated.jmx', 'jmx', 'JMeter (.jmx)' );
				break;
		}
	} else {
		window.alert( "Nothing to Save." );
	}
}

function writeTo( contents, title, filename, extension, filterTitle ){
	var file = performanceShowFileSaver(window, title, filename, extension, filterTitle);	
	if (file != null) {
		var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance( Components.interfaces.nsIFileOutputStream);
		outputStream.init(file, 0x02 | 0x08 | 0x20, 0644, 0);
		outputStream.write(contents, contents.length);
		outputStream.close();
	}
}

function performanceShowFileSaver(window, title, filename, extension, filterTitle ) {
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.defaultExtension = extension;
	fp.defaultString = filename;
	fp.appendFilter( filterTitle, '*.' + extension );
	
	fp.init(window, title, Components.interfaces.nsIFilePicker.modeSave);
  var res = fp.show();
  if (res == nsIFilePicker.returnOK || res == nsIFilePicker.returnReplace) {
		if ( fp.file.leafName.indexOf('.' + extension ) < 0 ){
			fp.file.leafName += '.' + extension;
		}
    return fp.file;
  } else {
    return null;
  }
}
